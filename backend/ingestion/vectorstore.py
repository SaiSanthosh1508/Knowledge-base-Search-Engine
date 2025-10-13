from ingestion.upsert import upsert_documents,convert_pdf_to_documents
from langchain_pinecone import PineconeVectorStore,PineconeEmbeddings
from pinecone import Pinecone
from dotenv import load_dotenv
import os

load_dotenv()

embeddings = PineconeEmbeddings(model="llama-text-embed-v2",dimension=1024,show_progress_bar=True)

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("search-engine")

vectorstore = PineconeVectorStore(
    index = index,
    embedding = embeddings,
	text_key="text",
)

def get_retriever(paths,index):
    docs = convert_pdf_to_documents(paths)
    upsert_documents(docs,index)
    return vectorstore.as_retriever()


