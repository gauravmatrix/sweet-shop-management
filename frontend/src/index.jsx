import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  throw new Error('Root element not found. Check your index.html file.');
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
              fontFamily: '"Comic Neue", cursive',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ECDC4',
                secondary: '#fff',
              },
              style: {
                background: '#10B981',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#FF6B8B',
                secondary: '#fff',
              },
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);