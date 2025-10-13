from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field
from langchain_core.tools.base import ArgsSchema
from typing import Optional
from langchain_core.documents.base import Document
from langchain_core.retrievers import BaseRetriever
from langgraph.graph import MessagesState
from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode,tools_condition
from langchain_core.messages import AIMessage
from langgraph.checkpoint.memory import InMemorySaver
from langchain.chat_models import init_chat_model
from tools.tools import RetrieverTool
from ingestion.vectorstore import get_retriever
from dotenv import load_dotenv
import json
import os

load_dotenv()

def get_rag_graph(paths: list[str],index):
    retriever = get_retriever(paths,index)
    retriever_tool = RetrieverTool(retriever=retriever)
    model = init_chat_model("google_genai:gemini-2.5-flash", temperature=0)

    def generate_query_or_respond(state: MessagesState):
        """Call the model to generate a response based on the current state. Given
        the question, it will decide to retrieve using the retriever tool, or simply respond to the user.
        """
        response = (
            model.bind_tools([retriever_tool]).invoke(state["messages"])  
        )
        return {"messages": [response]}

    from pydantic import BaseModel, Field
    from typing import Literal

    GRADE_PROMPT = (
        "You are a grader assessing relevance of a retrieved document to a user question. \n "
        "Here is the retrieved document: \n\n {context} \n\n"
        "Here is the user question: {question} \n"
        "If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n"
        "Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."
    )


    class GradeDocuments(BaseModel):  
        """Grade documents using a binary score for relevance check."""

        binary_score: str = Field(
            description="Relevance score: 'yes' if relevant, or 'no' if not relevant"
        )


    grader_model = init_chat_model("google_genai:gemini-2.5-flash", temperature=0)


    def grade_documents(
        state: MessagesState,
    ) -> Literal["generate_answer", "rewrite_question"]:
        """Determine whether the retrieved documents are relevant to the question."""
        question = state["messages"][0].content
        context = state["messages"][-1].content

        prompt = GRADE_PROMPT.format(question=question, context=context)
        response = (
            grader_model
            .with_structured_output(GradeDocuments).invoke(  
                [{"role": "user", "content": prompt}]
            )
        )
        score = response.binary_score

        if score == "yes":
            return "generate_answer"
        else:
            return "rewrite_question"
        
    REWRITE_PROMPT = (
        "Look at the input and try to reason about the underlying semantic intent / meaning.\n"
        "Here is the initial question:"
        "\n ------- \n"
        "{question}"
        "\n ------- \n"
        "Formulate an improved question:"
    )


    def rewrite_question(state: MessagesState):
        """Rewrite the original user question."""
        messages = state["messages"]
        question = messages[0].content
        prompt = REWRITE_PROMPT.format(question=question)
        response = model.invoke([{"role": "user", "content": prompt}])
        return {"messages": [{"role": "user", "content": response.content}]}



    GENERATE_PROMPT = (
        "You are an assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer the question. The answer must be detailed and comprehensive. "
        "If you don't know the answer, just say that you don't know. "
        "Also give the right references to the context.\n"
        "Question: {question} \n"
        "Context: {context}"
    )

    class Citation(BaseModel):
        text : str = Field(description="The exact text of the citation from the context")
        title : str = Field(description="The title of the document from which the citation is taken")
        page_no : int = Field(description="The page number of the document from which the citation is taken")
        file_source : str = Field(description="The source of the document from which the citation is taken,provide the file name or url")
        
    class ResponseWithCitation(BaseModel):
        answer : str = Field(description="The answer to the question based on the provided context")
        citations : list[Citation] = Field(description="List of citations of the context relevant to the answer")

    def generate_answer(state: MessagesState):
        """Generate an answer."""
        question = state["messages"][0].content
        context = state["messages"][-1].content
        prompt = GENERATE_PROMPT.format(question=question, context=context)
        model_with_citation = model.with_structured_output(ResponseWithCitation)
        response = model_with_citation.invoke([{"role": "user", "content": prompt}])

        response_json = json.dumps(response.model_dump(), indent=2)

        # Wrap the string content in an AIMessage
        return {"messages": [AIMessage(content=response_json)]}

    workflow = StateGraph(MessagesState)

    # Define the nodes we will cycle between
    workflow.add_node(generate_query_or_respond)
    workflow.add_node("retrieve", ToolNode([retriever_tool]))
    workflow.add_node(rewrite_question)
    workflow.add_node(generate_answer)

    workflow.add_edge(START, "generate_query_or_respond")

    # Decide whether to retrieve
    workflow.add_conditional_edges(
        "generate_query_or_respond",
        tools_condition,
        {
            "tools": "retrieve",
            END: END,
        },
    )

    # Edges taken after the `action` node is called.
    workflow.add_conditional_edges(
        "retrieve",
        # Assess agent decision
        grade_documents,
    )
    workflow.add_edge("generate_answer", END)
    workflow.add_edge("rewrite_question", "generate_query_or_respond")

    # Compile
    graph = workflow.compile(debug=True,
                            checkpointer=InMemorySaver())

    return graph