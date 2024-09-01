import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import global CSS
import App from './App';  // Import the root component
import reportWebVitals from './reportWebVitals';  // Import performance monitoring

// Create a root element and render the App component into the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Measure performance in your app (e.g., with reportWebVitals(console.log))
reportWebVitals();
