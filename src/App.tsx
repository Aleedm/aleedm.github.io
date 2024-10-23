import './App.css';
import Appbar from './Appbar/Appbar';
import Home from './Home/Home';
import HomePhone from './Home/HomePhone';
import ThemeProvider from './Theme/ThemeProviderStatic';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


function App() {
  document.title = 'Alessandro De Marco';

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  return (
    <ThemeProvider>
      <Appbar />
      {isXs || isSm ? <HomePhone /> : <Home />}
    </ThemeProvider>
  );
}

export default App;
