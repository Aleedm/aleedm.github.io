import React, { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ThemeContext from '../Theme/ThemeContext';

const ThemeToggleButton = ({ displayAsText = false }) => {
    const { mode, toggleTheme } = useContext(ThemeContext);
    return (displayAsText ?
        (<Button onClick={toggleTheme.toggleColorMode} color="inherit">
            {mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Button>) :
        (<IconButton sx={{ ml: 1 }} onClick={toggleTheme.toggleColorMode} color="inherit">
            {/* {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} */}
            {mode === 'dark' ? "☀️" : "🌙"}
        </IconButton>)
    );
};

export default ThemeToggleButton;
