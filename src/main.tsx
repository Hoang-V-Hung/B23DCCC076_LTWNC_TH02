import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoutineProvider } from './features/routines/RoutineContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RoutineProvider><BrowserRouter><App /></BrowserRouter></RoutineProvider>
    </ThemeProvider>
  </StrictMode>,
);
