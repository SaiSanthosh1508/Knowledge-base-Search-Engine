from tempfile import TemporaryDirectory
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader
import shutil
import os

def convert_pdf_to_documents(pdf_paths : list[str]):
	documents = []

	text_splitter = RecursiveCharacterTextSplitter(
		chunk_size=2000,
		chunk_overlap=200,
	)

	for path in pdf_paths:
		if path.endswith(".pdf"):
			loader = PyMuPDFLoader(
				file_path=path,
				extract_tables="markdown"
			)

			docs = loader.load_and_split(text_splitter)
			documents.extend(docs)
	
	return documents

def upsert_documents(documents, index, batch_size=96):
    docs_to_upsert = []
    for i, doc in enumerate(documents):
        docs_to_upsert.append({
            "_id": f"doc-{i}",
            "text": doc.page_content,
            "page_no": doc.metadata.get("page", 0) + 1,
            "title": doc.metadata.get("title", ""),
            "file_source": doc.metadata.get("source", ""),
        })
        
    # Upsert in batches
    for i in range(0, len(docs_to_upsert), batch_size):
        batch = docs_to_upsert[i:i+batch_size]
        index.upsert_records("__default__", records=batch)
    print(f"Upserted {len(docs_to_upsert)} vectors in batches of {batch_size}")
