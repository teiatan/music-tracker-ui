import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ToastContainer from './components/ToastContainer/ToastContainer.tsx';
import ContextProviders from './context/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextProviders>
      <App />
      <ToastContainer />
    </ContextProviders>
  </StrictMode>
);
