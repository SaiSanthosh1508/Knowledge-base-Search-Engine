import React, { useRef } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function FileUploader({ onFilesSelected, selectedFiles = [] }) {
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (onFilesSelected) onFilesSelected(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    // Filter only PDF files
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== files.length) {
      alert('Only PDF files are allowed');
    }
    if (onFilesSelected && pdfFiles.length > 0) onFilesSelected(pdfFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
  };

  return (
    <div className="rounded-lg">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className="upload-area"
        onClick={() => fileInputRef.current.click()}
        style={{ minHeight: '200px' }}
      >
        <CloudUploadIcon style={{ 
          fontSize: 64, 
          color: 'var(--color-primary)',
          marginBottom: '1rem'
        }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            fontSize: 'var(--text-lg)', 
            fontWeight: '500', 
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem'
          }}>
            Drag and drop PDF files here
          </p>
          <p style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-text-secondary)',
            marginBottom: '0.5rem'
          }}>
            or click to select files
          </p>
          <p style={{ 
            fontSize: 'var(--text-xs)', 
            color: 'var(--color-text-muted)'
          }}>
            Only PDF files are supported
          </p>
        </div>
        {selectedFiles.length > 0 && (
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--color-primary)', 
            fontWeight: '500',
            marginTop: '1rem'
          }}>
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}