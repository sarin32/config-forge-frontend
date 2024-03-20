import {ThemeProvider} from './components/theme-provider';
import {RootRoutes} from './routes';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RootRoutes />
    </ThemeProvider>
  );
}

export default App;
