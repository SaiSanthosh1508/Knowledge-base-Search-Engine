"""
Configuration management for the RAG Engine
Handles environment variables for both local development and production deployment
"""
import os
from dotenv import load_dotenv

# Load .env file if it exists (for local development)
load_dotenv()

class Config:
    """Application configuration class"""
    
    # Required environment variables
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    LANGCHAIN_API_KEY = os.getenv("LANGCHAIN_API_KEY")
    
    # Optional environment variables with defaults
    LANGCHAIN_TRACING_V2 = os.getenv("LANGCHAIN_TRACING_V2", "false").lower() == "true"
    LANGCHAIN_PROJECT = os.getenv("LANGCHAIN_PROJECT", "rag-engine")
    
    # Server configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "8000"))
    
    # Pinecone configuration
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "search-engine")
    
    @classmethod
    def validate(cls):
        """Validate that all required environment variables are set"""
        required_vars = [
            ("PINECONE_API_KEY", cls.PINECONE_API_KEY),
            ("OPENAI_API_KEY", cls.OPENAI_API_KEY),
        ]
        
        missing_vars = []
        for var_name, var_value in required_vars:
            if not var_value:
                missing_vars.append(var_name)
        
        if missing_vars:
            raise ValueError(
                f"Missing required environment variables: {', '.join(missing_vars)}\n"
                "Please set them in your environment or .env file"
            )
        
        return True

# Validate configuration on import
config = Config()
config.validate()