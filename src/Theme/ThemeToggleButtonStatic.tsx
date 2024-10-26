import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ThemeContext from '../Theme/ThemeContext';
import { trackEvent } from '../Home/utils';

const ThemeToggleButton = ({ displayAsText = false }) => {
    const { mode, toggleTheme } = useContext(ThemeContext);

    const handleToggle = () => {
        toggleTheme.toggleColorMode();
        trackEvent('toggle_theme', { mode: mode === 'dark' ? 'light' : 'dark' });
    }

    return (displayAsText ?
        (<Button onClick={handleToggle} color="inherit">
            {mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>) :
        (<IconButton sx={{ ml: 1 }} onClick={handleToggle} color="inherit">
            {/* {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} */}
            {/* {mode === 'dark' ? "☀️" : "🌙"} */}
            <div
                style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: mode === 'dark' ? '#fff' : '#121212',
                }}
            />
        </IconButton>)
    );
};

export default ThemeToggleButton;
