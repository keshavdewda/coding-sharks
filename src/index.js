import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Fix for ResizeObserver loop limit exceeded error
const resizeObserverError = /ResizeObserver loop completed with undelivered notifications/;
window.addEventListener('error', (e) => {
  if (resizeObserverError.test(e.message)) {
    e.stopImmediatePropagation();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
