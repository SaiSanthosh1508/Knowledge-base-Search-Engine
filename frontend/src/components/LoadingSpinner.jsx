import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress size={40} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}