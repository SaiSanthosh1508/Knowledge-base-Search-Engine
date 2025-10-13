import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import UploadButton from '../components/UploadButton';
import FilePreview from '../components/FilePreview';
import QuerySection from '../components/QuerySection';
import { useToast } from '../hooks/useToast';

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [showUploadMore, setShowUploadMore] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { showSuccess, showError, showWarning } = useToast();

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, idx) => idx !== index);
    setSelectedFiles(newFiles);
  };

  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
    setUploadedFiles([...uploadedFiles, ...selectedFiles]);
    setSelectedFiles([]);
    setIsUploaded(true);
    setShowUploadMore(false); // Hide the upload interface after successful upload
    showSuccess(`Successfully uploaded ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}!`);
  };

  const handleUploadError = (error) => {
    showError(error);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('https://knowledge-base-search-engine-0zb9.onrender.com/reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('Reset response:', data);
      
      if (response.ok && data.status === 'success') {
        setUploadedFiles([]);
        setSelectedFiles([]);
        setIsUploaded(false);
        setShowUploadMore(false);
        showSuccess('Vector database reset successfully! You can now upload new documents.');
      } else {
        const errorMessage = data.detail || data.message || 'Failed to reset vector database. Please try again.';
        showError(errorMessage);
      }
    } catch (error) {
      console.error('Reset error:', error);
      showError('Network error: Could not connect to the server. Please check if the backend is running.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
  };

  const handleUploadMore = () => {
    // Keep uploaded files visible and allow new uploads
    setSelectedFiles([]);
    setShowUploadMore(true);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            Knowledge Based Search Engine
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)' }}>
            Upload your PDF documents and ask intelligent questions
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Show uploaded files if any exist */}
          {isUploaded && uploadedFiles.length > 0 && (
            <div className="card" style={{ backgroundColor: '#f0fdf4', borderColor: 'var(--color-success)' }}>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
                      Documents Uploaded Successfully!
                    </h3>
                    <p style={{ color: 'var(--color-success)' }}>
                      {uploadedFiles.length} document{uploadedFiles.length > 1 ? 's' : ''} ready for querying
                    </p>
                  </div>
                  {!showUploadMore && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={handleUploadMore}
                        className="btn btn-success"
                      >
                        Upload More
                      </button>
                      <button
                        onClick={handleReset}
                        disabled={isResetting}
                        className="btn btn-secondary"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          opacity: isResetting ? 0.7 : 1
                        }}
                      >
                        {isResetting ? (
                          <div className="spinner"></div>
                        ) : (
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                          </svg>
                        )}
                        {isResetting ? 'Resetting...' : 'Reset All'}
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Show uploaded files */}
                <div className="mt-6">
                  <h4 style={{ fontWeight: '500', color: 'var(--color-success)', marginBottom: '1rem' }}>
                    Uploaded Files:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-success)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div style={{ color: 'var(--color-success)' }}>
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                          </svg>
                        </div>
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <p style={{ 
                            fontWeight: '500', 
                            color: 'var(--color-success)', 
                            margin: '0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            flex: '1'
                          }} title={file.name}>
                            {file.name}
                          </p>
                          <span style={{ 
                            fontSize: 'var(--text-xs)', 
                            color: 'var(--color-success)',
                            fontWeight: '500',
                            flexShrink: '0'
                          }}>
                            ✓ Ready
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show upload interface for initial upload or when "Upload More" is clicked */}
          {(!isUploaded || showUploadMore) && (
            <div className="card" style={{ marginBottom: isUploaded ? '0' : '2rem' }}>
              <div className="card-body">
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-primary)' }}>
                  {isUploaded ? 'Upload Additional Documents' : 'Upload Documents'}
                </h2>
                
                <FileUploader 
                  onFilesSelected={handleFilesSelected} 
                  selectedFiles={selectedFiles}
                />
                
                {selectedFiles.length > 0 && (
                  <>
                    <FilePreview 
                      files={selectedFiles} 
                      onRemoveFile={handleRemoveFile}
                    />
                    
                    <div className="flex gap-4 justify-center mt-8">
                      <UploadButton 
                        files={selectedFiles} 
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                      />
                      <button
                        onClick={handleClearFiles}
                        className="btn btn-secondary"
                      >
                        Clear All
                      </button>
                      {isUploaded && (
                        <button
                          onClick={() => setShowUploadMore(false)}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Query Section - only show if documents are uploaded */}
          {isUploaded && <QuerySection />}
        </div>
      </div>
    </div>
  );
}