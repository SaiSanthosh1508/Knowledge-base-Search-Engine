import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ImageIcon from '@mui/icons-material/Image';

export default function ResultsSection({ response, isLoading, query }) {
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [expandedImages, setExpandedImages] = useState({});

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body" style={{ textAlign: 'center' }}>
          <div className="flex items-center justify-center">
            <div className="spinner"></div>
            <span style={{ marginLeft: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Searching through your documents...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard');
    });
  };

  const toggleImageExpanded = (index) => {
    setExpandedImages(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  let parsedAnswer;
  try {
    parsedAnswer = typeof response.answer === 'string' 
      ? JSON.parse(response.answer) 
      : response.answer;
  } catch {
    parsedAnswer = { answer: response.answer };
  }

  return (
    <div className="results-container">
      {/* Header */}
      <div style={{ backgroundColor: '#f0fdf4', borderBottom: '1px solid var(--color-success)', padding: '1.5rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
          Answer
        </h2>
        {query && (
          <p style={{ color: 'var(--color-success)', fontStyle: 'italic' }}>
            "{query}"
          </p>
        )}
      </div>

      {/* Main Answer */}
      <div>
        <div style={{ backgroundColor: 'var(--color-secondary)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="flex items-start justify-between" style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Response:
            </h3>
            <button
              onClick={() => copyToClipboard(parsedAnswer.answer || response.answer)}
              style={{
                color: 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
              title="Copy answer"
            >
              <ContentCopyIcon fontSize="small" />
            </button>
          </div>
          <div className="answer-text">
            {parsedAnswer.answer || response.answer || 'No answer provided'}
          </div>
        </div>

        {/* References Section */}
        {response.references && response.references.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              Sources & References ({response.references.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {response.references.map((ref, idx) => {
                // Parse reference if it's a JSON string, otherwise use directly
                let referenceData;
                try {
                  referenceData = typeof ref === 'string' ? JSON.parse(ref) : ref;
                } catch {
                  referenceData = ref;
                }

                // Extract reference information with correct field names from backend
                const referenceText = referenceData.text || referenceData.content || (typeof ref === 'string' ? ref : JSON.stringify(ref));
                let pageNumber = referenceData.page_no || referenceData.page || referenceData.page_number;
                let fileSource = referenceData.source || referenceData.file_source || referenceData.filename || 'Unknown Document';
                
                // Clean up file source - remove temp directory path and show just filename
                if (typeof fileSource === 'string') {
                  fileSource = fileSource.replace(/^.*[/\\]/, '').replace('temp_upload_dir\\', '').replace('temp_upload_dir/', '');
                }
                
                // Ensure page number is valid
                if (!pageNumber || pageNumber === 'N/A' || pageNumber === 'Unknown' || pageNumber === null || pageNumber === undefined) {
                  pageNumber = 'N/A';
                } else {
                  pageNumber = String(pageNumber);
                }

                return (
                  <div key={idx} className="card" style={{ width: '100%' }}>
                    <div className="card-body" style={{ padding: '1.25rem' }}>
                      {/* Reference Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h4 style={{ 
                          fontSize: 'var(--text-base)', 
                          fontWeight: '600', 
                          color: 'var(--color-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <svg width="16" height="16" fill="var(--color-primary)" viewBox="0 0 16 16">
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                          </svg>
                          Reference {idx + 1}
                        </h4>
                        <button
                          onClick={() => copyToClipboard(typeof ref === 'string' ? ref : JSON.stringify(ref, null, 2))}
                          style={{
                            color: 'var(--color-text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = 'var(--color-primary)';
                            e.target.style.background = 'var(--color-primary-light)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = 'var(--color-text-muted)';
                            e.target.style.background = 'none';
                          }}
                          title="Copy reference"
                        >
                          <ContentCopyIcon fontSize="small" />
                        </button>
                      </div>

                      {/* Reference Text */}
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{
                          backgroundColor: 'var(--color-secondary)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1rem',
                          border: '1px solid var(--color-border)',
                          minHeight: '80px',
                          maxHeight: '150px',
                          overflowY: 'auto'
                        }}>
                          <p style={{ 
                            fontSize: 'var(--text-sm)', 
                            lineHeight: '1.6',
                            color: 'var(--color-text-primary)',
                            margin: '0',
                            textAlign: 'justify'
                          }}>
                            {referenceText}
                          </p>
                        </div>
                      </div>

                      {/* Reference Metadata */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--color-surface-hover)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="14" height="14" fill="var(--color-text-muted)" viewBox="0 0 16 16">
                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                          </svg>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                            Page {pageNumber}
                          </span>
                        </div>
                        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border)' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', minWidth: '0' }}>
                          <svg width="14" height="14" fill="var(--color-text-muted)" viewBox="0 0 16 16">
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                          </svg>
                          <span 
                            style={{ 
                              fontSize: 'var(--text-sm)', 
                              color: 'var(--color-text-secondary)', 
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={fileSource}
                          >
                            {fileSource}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Images Section */}
        {response.image_urls && response.image_urls.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon />
              Visual References ({response.image_urls.length})
            </h3>
            <div className="image-gallery">
              {response.image_urls.map((imageUrl, idx) => (
                <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imageUrl}
                      alt={`Reference ${idx + 1}`}
                      className="result-image"
                      style={{
                        maxHeight: expandedImages[idx] ? 'none' : '12rem',
                        transition: 'all var(--transition-normal)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none', padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <ImageIcon />
                      <p style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>Image failed to load</p>
                    </div>
                    <button
                      onClick={() => toggleImageExpanded(idx)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        padding: '0.25rem',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.7)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
                    >
                      {expandedImages[idx] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </button>
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-secondary)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      Reference {idx + 1}
                    </p>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', textDecoration: 'none', transition: 'color var(--transition-fast)' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-hover)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--color-primary)'}
                    >
                      View full size
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Response Toggle */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <button
            onClick={() => setShowRawResponse(!showRawResponse)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
          >
            {showRawResponse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            {showRawResponse ? 'Hide' : 'Show'} Raw Response
          </button>
          
          {showRawResponse && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--color-secondary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                maxHeight: '24rem',
                overflow: 'auto',
                fontFamily: 'var(--font-mono)'
              }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                    Raw API Response:
                  </h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                    style={{
                      color: 'var(--color-text-muted)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      transition: 'color var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                    title="Copy raw response"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </button>
                </div>
                <pre style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4'
                }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}