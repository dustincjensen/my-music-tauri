import { MantineProvider } from '@mantine/core';
import ReactDOM from 'react-dom/client';
import { App } from './components/app/app.component';
import './main.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <MantineProvider theme={{
    primaryColor: 'cyan',
    defaultRadius: 'sm',
    colorScheme: 'dark'
  }} withGlobalStyles withNormalizeCSS>
    <App />
  </MantineProvider>
  // </React.StrictMode>
);
