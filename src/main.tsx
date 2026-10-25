import ReactDOM from 'react-dom/client';
import App from './App';
import './experience/experience.css';
import { installAnalytics } from './experience/analytics';

installAnalytics();
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
