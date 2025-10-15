import uvicorn
from api.app import app
def main():
    """Run the FastAPI server"""
    uvicorn.run(
        "api.app:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Enable auto-reload during development
        log_level="info"
    )

if __name__ == "__main__":
    main()
