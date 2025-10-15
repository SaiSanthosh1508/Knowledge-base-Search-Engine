# Knowledge-base-Search-Engine

A full-stack Retrieval-Augmented Generation (RAG) system for intelligent document search and Q&A, built with React, LangGraph, FastAPI, Pinecone, and modern LLMs.

🚀 Live Demo: <br><br>
[https://knowledge-base-search-engine-theta.vercel.app/](https://knowledge-base-search-engine-theta.vercel.app/)

### View Application Working<br>
https://github.com/user-attachments/assets/e9107248-19fc-4ed5-962d-faf13664cec5

### Architecture

- #### Application Architecture

<img width="965" height="496" alt="rag-architecture" src="https://github.com/user-attachments/assets/b5359059-54b0-4a50-8616-502b184fa123" />

- ### Agentic RAG Workflow

<img width="402" height="456" alt="be190636-5a03-4969-8e5e-96f4158cc912" src="https://github.com/user-attachments/assets/b1bdc017-4482-4e9f-8c13-9e7ad4baed76" />

### 🌟 Features

- **PDF Upload:** Drag-and-drop or select files, with instant preview<br>
- **Vector Database:** Documents indexed in Pinecone for semantic search<br>
- **Intelligent Q&A:** Ask questions, get answers with references and page images<br>
- **Modern UI:** Responsive React frontend, animated notifications, clean design<br>
- **Reset Functionality:** Clear vector DB and temp files with one click<br>
- **Scalable Deployment:** Backend on Render, frontend on Vercel/Netlify<br>

### 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Material-UI, CSS custom properties, Toast notifications
- **Backend:** FastAPI, LangChain, LangGraph, Pinecone, OpenAI/Gemini LLMs
- **Vector DB:** Pinecone
- **Deployment:** Render (API), Vercel/Netlify (Frontend)

### ⚡ Quick Start

1. Clone the repo
```python
git clone https://github.com/your-username/knowledge-base-search-engine.git
cd knowledge-base-search-engine
```

2. Backend Setup
```python
cd rag-engine/backend
python -m venv .venv
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
# Set environment variables (see .env.example)
python main.py
```

3. FrontEnd Setup
```python
cd rag-engine/frontend
npm install
npm run dev
```

4. Environment Variables
Create a `.env` file in backend/:
```python
PINECONE_API_KEY=your_pinecone_key
GOOGLE_API_KEY = your_gemini_key
```

### 🌐 Deployment
- **Backend:** Deploy to Render
- **Frontend:** Deploy to Vercel or Netlify
- **Vector DB:** Pinecone (managed)

### 📚 Usage
- Upload PDFs via the frontend
- Ask questions about your documents
- View answers with references and page images
- Reset the database as needed if need be to work with a different set of documents

### 📦 Project Structure
```
rag-engine/
  backend/
    api/
    ingestion/
    rag_graph/
    tools/
    main.py
    requirements.txt
  frontend/
    src/
    public/
    vite.config.js
    package.json
```

### 📞 Contact
For questions or support, open an issue or email `santhoshroyal8177@gmail.com`
