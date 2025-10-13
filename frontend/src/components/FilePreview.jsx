import React from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FilePreview({ files, onRemoveFile }) {
  if (!files || files.length === 0) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-6">
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
        Selected Files ({files.length})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {files.map((file, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <PictureAsPdfIcon style={{ color: '#ef4444', flexShrink: '0' }} />
            <div style={{ flex: '1', minWidth: '0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <p style={{ 
                fontWeight: '500', 
                color: 'var(--color-text-primary)', 
                margin: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: '1'
              }} title={file.name}>
                {file.name}
              </p>
              <span style={{ 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-muted)',
                fontWeight: '500',
                flexShrink: '0'
              }}>
                {formatFileSize(file.size)}
              </span>
            </div>
            {onRemoveFile && (
              <button
                onClick={() => onRemoveFile(idx)}
                style={{
                  color: 'var(--color-text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all var(--transition-fast)',
                  flexShrink: '0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-error)';
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-text-muted)';
                  e.target.style.backgroundColor = 'transparent';
                }}
                title="Remove file"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}