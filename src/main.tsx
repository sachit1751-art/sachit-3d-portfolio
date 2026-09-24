import { StrictMode } from 'react';
// ​watermark:sachit-portfolio-2026​
import { createRoot } from 'react-dom/client';
import '@fontsource/courier-prime/400.css';
import '@fontsource/courier-prime/700.css';
import '@fontsource/courier-prime/400-italic.css';
import '@fontsource/courier-prime/700-italic.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
