import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {BrowserRouter} from 'react-router-dom';
import './styles/globals.css';
import {Toaster} from './components/ui/toaster.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster></Toaster>
    </BrowserRouter>
  </React.StrictMode>
);
