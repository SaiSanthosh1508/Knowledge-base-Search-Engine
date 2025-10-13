import React, { useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import CircularProgress from '@mui/material/CircularProgress';

const UploadButton = ({ files, onUploadSuccess, onUploadStart, onUploadError }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      if (onUploadError) onUploadError("No files selected for upload");
      return;
    }

    // Check if all files are PDFs
    const nonPdfFiles = files.filter(file => file.type !== 'application/pdf');
    if (nonPdfFiles.length > 0) {
      if (onUploadError) onUploadError("Only PDF files are allowed");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    if (onUploadStart) onUploadStart();

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/uploadfile/', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Upload response:', data);
        setUploadStatus('success');
        
        // Show success animation briefly before calling success callback
        setTimeout(() => {
          if (onUploadSuccess) onUploadSuccess(data);
          setUploadStatus(null);
        }, 1500);
      } else {
        const errorData = await response.json();
        setUploadStatus('error');
        if (onUploadError) onUploadError(`Failed to upload files: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus('error');
      if (onUploadError) onUploadError('Error during upload. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getButtonContent = () => {
    if (uploadStatus === 'success') {
      return (
        <>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ animation: 'bounce 0.6s ease-in-out' }}>
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
          Success!
        </>
      );
    }
    
    if (uploadStatus === 'error') {
      return (
        <>
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ animation: 'shake 0.6s ease-in-out' }}>
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
          </svg>
          Error
        </>
      );
    }
    
    if (isUploading) {
      return (
        <>
          <CircularProgress size={20} color="inherit" />
          Uploading...
        </>
      );
    }
    
    return (
      <>
        <UploadIcon />
        Upload Files
      </>
    );
  };

  return (
    <button 
      onClick={handleUpload}
      disabled={isUploading || uploadStatus === 'success' || !files || files.length === 0}
      className={`btn ${uploadStatus === 'success' ? 'btn-success' : uploadStatus === 'error' ? 'btn btn-secondary' : 'btn-primary'}`}
      style={{ 
        minWidth: '140px',
        transition: 'all var(--transition-normal)',
        transform: uploadStatus === 'success' ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {getButtonContent()}
    </button>
  );
};

export default UploadButton;