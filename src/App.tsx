import './App.css';
import Appbar from './Appbar/Appbar';
import Home from './Home/Home';
import ThemeProvider from './Theme/ThemeProvider';

function App() {
  document.title = 'Alessandro De Marco';
  return (
    <ThemeProvider>
      <Appbar />
      <Home />
    </ThemeProvider>
  );
}

export default App;
