# Knowledge Based Search Engine - Frontend

A React-based frontend for the Knowledge Based Search Engine that allows users to upload PDF documents and query them using AI.

## Features

- **Document Upload**: Drag and drop or click to upload PDF files
- **File Preview**: See selected files before uploading with file size information
- **Visual Feedback**: Clear indication of upload progress and success
- **Query Interface**: Ask questions about uploaded documents
- **Results Display**: View answers with sources and visual references
- **Responsive Design**: Works on desktop and mobile devices

## Components

### Core Components

- **FileUploader**: Handles file selection with drag & drop functionality
- **UploadButton**: Manages file upload to the backend
- **FilePreview**: Shows selected files with options to remove them
- **QuerySection**: Interface for asking questions
- **ResultsSection**: Displays AI responses with sources and images

### Pages

- **UploadPage**: Main page combining upload and query functionality

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- Backend API running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd rag-engine/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

- `POST /uploadfile/` - Upload PDF documents
- `POST /query/?query=<question>` - Query uploaded documents
- `GET /temp_images/*` - Serve generated reference images

## Configuration

The Vite configuration includes proxy settings to forward API requests to the backend:

```javascript
server: {
  proxy: {
    '/uploadfile': 'http://localhost:8000',
    '/query': 'http://localhost:8000',
    '/temp_images': 'http://localhost:8000'
  }
}
```

## Usage

1. **Upload Documents**:
   - Drag and drop PDF files or click to select
   - Review selected files in the preview
   - Click "Upload Files" to process documents

2. **Query Documents**:
   - After successful upload, enter questions in the text area
   - Use sample queries for quick testing
   - View results with sources and visual references

3. **Upload More Documents**:
   - Click "Upload More" to add additional documents
   - Previous uploads are maintained in the system

## Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **Material-UI Icons** for consistent iconography
- **Material-UI Components** for loading indicators

## Error Handling

- File type validation (PDF only)
- Network error handling
- User feedback through alerts and UI states
- Loading states for better user experience

## Browser Support

- Modern browsers with ES6+ support
- File API support for drag & drop functionality
- Fetch API for HTTP requests
