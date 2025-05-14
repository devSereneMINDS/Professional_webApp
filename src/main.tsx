import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CssVarsProvider } from '@mui/joy';
import { CssBaseline } from '@mui/material';
import {  Provider } from 'react-redux';
import store from "./store/store.ts"
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <CssVarsProvider>
        <CssBaseline>
          <App />
        </CssBaseline>
      </CssVarsProvider>
    </Provider>
  </StrictMode>,
)
