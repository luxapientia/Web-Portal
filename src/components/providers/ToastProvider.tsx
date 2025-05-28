import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#4caf50',
          },
        },
        error: {
          style: {
            background: '#f44336',
          },
          duration: 4000,
        },
        loading: {
          style: {
            background: '#2196f3',
          },
        },
      }}
    />
  );
} 