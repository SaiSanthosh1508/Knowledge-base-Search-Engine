import React from 'react';
import UploadPage from './pages/UploadPage';
import { ToastProvider } from './components/ToastProvider';

export default function App() {
  return (
    <ToastProvider>
      <UploadPage />
    </ToastProvider>
  );
}