import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import ResultsSection from './ResultsSection';

export default function QuerySection() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`https://knowledge-base-search-engine-0zb9.onrender.com/query/?query=${encodeURIComponent(query.trim())}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setResponse(data);
        setQueryHistory(prev => [...prev, { query: query.trim(), timestamp: new Date() }]);
      } else {
        const errorData = await res.json();
        alert(`Failed to get answer: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Query error:", error);
      alert('An error occurred while fetching the answer. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const sampleQueries = [
    "What is the main topic of the document?",
    "Summarize the key points",
    "What are the conclusions?",
    "Extract important dates and numbers"
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Query Input Section */}
      <div className="card">
        <div className="card-body">
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '2rem', textAlign: 'center' }}>
            Ask Questions About Your Documents
          </h2>
          
          <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any question about your uploaded documents..."
                className="form-input form-textarea"
                rows={4}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SearchIcon />
                )}
              </button>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    Ask Question
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setQuery('')}
                disabled={isLoading}
                className="btn btn-secondary"
              >
                Clear
              </button>
            </div>
          </form>

          {/* Sample Queries */}
          <div className="mt-6">
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
              Try these sample questions:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {sampleQueries.map((sampleQuery, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSampleQuery(sampleQuery)}
                  disabled={isLoading}
                  style={{
                    fontSize: 'var(--text-sm)',
                    background: 'var(--color-surface-hover)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '9999px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.background = 'var(--color-primary-light)')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.background = 'var(--color-surface-hover)')}
                >
                  {sampleQuery}
                </button>
              ))}
            </div>
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
                Recent Questions:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '8rem', overflowY: 'auto' }}>
                {queryHistory.slice(-5).reverse().map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item.query)}
                    disabled={isLoading}
                    style={{
                      textAlign: 'left',
                      width: '100%',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      background: 'none',
                      border: 'none',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      opacity: isLoading ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => !isLoading && (e.target.style.background = 'var(--color-surface-hover)', e.target.style.color = 'var(--color-primary)')}
                    onMouseLeave={(e) => !isLoading && (e.target.style.background = 'transparent', e.target.style.color = 'var(--color-text-secondary)')}
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <ResultsSection response={response} isLoading={isLoading} query={query} />
    </div>
  );
}