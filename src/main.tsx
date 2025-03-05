import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react' ;
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// const PUBLISHABLE_KEY = import.meta.env.CLERK_PUBLISHABLE_KEY

const PUBLISHABLE_KEY = "pk_test_aW5ub2NlbnQtZm94aG91bmQtMTMuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);