import React, { useState } from 'react';
import FileUploader from './FileUploader';
import UploadButton from './UploadButton';
import FilePreview from './FilePreview';

export default function UploadSection({ onUploadSuccess, setIsLoading, isLoading }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, idx) => idx !== index);
    setSelectedFiles(newFiles);
  };

  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
    setSelectedFiles([]);
    if (onUploadSuccess) onUploadSuccess(data);
  };

  const handleUploadStart = () => {
    if (setIsLoading) setIsLoading(true);
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Upload Your Documents
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <UploadButton 
              files={selectedFiles} 
              onUploadSuccess={handleUploadSuccess}
              onUploadStart={handleUploadStart}
            />
            <button
              onClick={handleClearFiles}
              disabled={isLoading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
        </>
      )}
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Supported format: PDF files only</p>
        <p>You can upload multiple files at once</p>
      </div>
    </div>
  );
}