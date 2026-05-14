import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Router } from './Router';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <ModalsProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
