import {ThemeProvider} from './components/theme-provider';
import {RootRoutes} from './routes';

function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <RootRoutes />
    </ThemeProvider>
  );
}

export default App;
