import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import theme from './theme';

/*const githubTheme = extendTheme({
  fontFamily: {
    display: 'Figtree, sans-serif',
    body: 'Figtree, sans-serif',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: 'var(--joy-palette-primary-plainColor)',
        },
        primary: {
          '500': '#f4d04e',
        },
      },
    },
  },
});*/

/*ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider theme={githubTheme}>
      <App />
    </CssVarsProvider>
  </React.StrictMode>
);*/

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
