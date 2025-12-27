import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import Mantine Styles
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <Notifications />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>,
);