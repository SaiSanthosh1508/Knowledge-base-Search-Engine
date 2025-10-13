from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field
from langchain_core.tools.base import ArgsSchema
from typing import Optional
from langchain_core.documents.base import Document
from langchain_core.retrievers import BaseRetriever

class RetrieverInput(BaseModel):
	query : str = Field(description="The query string to search for relevant documents")

class RetrieverTool(BaseTool):
	name : str = "relevant_document_retriever"
	description : str = "Search and retrieve relevant documents from a set of documents based on a query"
	args_schema : Optional[ArgsSchema] = RetrieverInput
	return_direct : bool = True
	retriever : BaseRetriever

	def _run(self,query : str)->list[Document]:
		return self.retriever.invoke(query)
	
