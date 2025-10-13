from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from typing import List
import os
import shutil
from ingestion.vectorstore import index
from ingestion.upsert import convert_pdf_to_documents, upsert_documents
from rag_graph.graph import get_rag_graph
from utils import get_references_from_response, plot_sources_on_pdf
import random
import json

TEMP_DIR = "temp_upload_dir"
TEMP_IMAGE_DIR = "temp_images"
files_exists = False
graph = None

if not os.path.exists(TEMP_IMAGE_DIR):
    os.makedirs(TEMP_IMAGE_DIR)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global TEMP_DIR
    # Startup: Create temp directory
    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)
    print(f"Temporary directory '{TEMP_DIR}' created.")
    yield
    # Shutdown: Cleanup temp directory
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    if os.path.exists(TEMP_IMAGE_DIR):
        shutil.rmtree(TEMP_IMAGE_DIR)
    index.delete_namespace(namespace="__default__")
    print(f"Temporary directory '{TEMP_DIR}' removed.")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://knowledge-base-search-engine-theta.vercel.app/",
        "https://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/temp_images", StaticFiles(directory=TEMP_IMAGE_DIR), name="temp_images")


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/uploadfile/")
async def upload_files(files: List[UploadFile] = File(...)):
    global files_exists
    file_paths = []
    for file in files:
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail=f"File '{file.filename}' is not a PDF.")
        file_path = os.path.join(TEMP_DIR, file.filename)
        # Save uploaded file to temp dir
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        file_paths.append(file_path)
    print(f"Uploaded PDF files saved to: {file_paths}")

    ## Call ingestion to process and upsert documents
    global graph
    if graph is None:
        files_exists = True
        graph = get_rag_graph(file_paths,index)
        print("RAG graph initialized.", graph)
    elif files_exists:
        docs = convert_pdf_to_documents(file_paths)
        upsert_documents(docs,index)

    return {"uploaded_files": file_paths}


@app.post("/query/")
async def query_rag_engine(query: str):
    global graph
    if graph is None:
        raise HTTPException(status_code=400, detail="No documents uploaded yet.")
    else:
        thread_id = str(random.randint(1,9999))
        response = graph.invoke({
            "messages": [{
                "role": "user",
                "content": query
            }]
        }, {"configurable": {"thread_id": thread_id}})
        answer = response["messages"][-1].content
        json_response = json.loads(answer)
        references = get_references_from_response(json_response)
        image_paths = plot_sources_on_pdf(TEMP_IMAGE_DIR, json_response)
        
        # Convert paths to URLs for frontend
        image_urls = [f"/temp_images/{os.path.basename(path)}" for path in image_paths]
        
        return {
            "answer": answer,
            "references": references,
            "image_urls": image_urls
        }


@app.post("/reset/")
async def reset_vectorstore():
    try:
        global files_exists
        global graph
        
        print("Starting vector database reset...")
        
        # Reset global variables
        files_exists = False
        graph = None
        
        # Delete the vector namespace
        response = index.delete_namespace(namespace="__default__")
        print(f"Vector database reset response: {response}")
        
        # Also clean up temporary files if they exist
        if os.path.exists(TEMP_DIR):
            for filename in os.listdir(TEMP_DIR):
                file_path = os.path.join(TEMP_DIR, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    print(f"Error deleting file {file_path}: {e}")
        
        # Clean up temp images
        if os.path.exists(TEMP_IMAGE_DIR):
            for filename in os.listdir(TEMP_IMAGE_DIR):
                file_path = os.path.join(TEMP_IMAGE_DIR, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    print(f"Error deleting image file {file_path}: {e}")
        
        print("Vector database reset completed successfully")
        return {"status": "success", "message": "Vector database reset successfully", "details": response}
        
    except Exception as e:
        print(f"Error resetting vector database: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to reset vector database: {str(e)}")
