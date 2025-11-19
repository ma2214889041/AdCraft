import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Index.tsx loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found, creating React root...');

try {
  const root = ReactDOM.createRoot(rootElement);
  console.log('React root created, rendering App...');

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering app:', error);
  // Display error on page
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; font-family: monospace;">
      <h1>Application Error</h1>
      <pre>${error}</pre>
    </div>
  `;
}