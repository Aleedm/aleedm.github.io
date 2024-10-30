import { useEffect, useState } from 'react';
import './App.css';
import Appbar from './Appbar/Appbar';
import Home from './Home/Home';
import HomePhone from './Home/HomePhone';
import ThemeProvider from './Theme/ThemeProviderStatic';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getInfo, sendTelegramNotification, trackEvent } from './Home/utils';

declare global {
  interface Window {
    sa_event?: (eventName: string, metadata?: Record<string, any>, callback?: () => void) => void;
  }
}


function App() {
  document.title = 'Alessandro De Marco';

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const [unit, setUnit] = useState('cm');

  useEffect(() => {
    const fetchUnit = async () => {
      const { unit, city, region, country } = await getInfo();
      setUnit(unit);
      sendTelegramNotification(country, region, city);
      trackEvent('Visitor', { c: city, r: region });
    };
    fetchUnit();
  }, []);

  return (
    <ThemeProvider>
      <Appbar />
      {isXs || isSm ? <HomePhone unit={unit} /> : <Home unit={unit} />}
    </ThemeProvider>
  );
}

export default App;
