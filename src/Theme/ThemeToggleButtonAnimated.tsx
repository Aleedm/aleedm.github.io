import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import IconButton from '@mui/material/IconButton';
import ThemeContext from './ThemeContext';

import ExpandingOverlay from './ExpandingOverlay';

const ThemeToggleButton = () => {
    const { mode, toggleTheme } = useContext(ThemeContext);
    const [isAnimating, setIsAnimating] = useState(false);
    const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });

    const handleClick = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCirclePosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setIsAnimating(true);
    };

    const onAnimationEnd = () => {
        toggleTheme.toggleColorMode();
        setIsAnimating(false);
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                color="inherit"
            >
                <div
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: mode === 'dark' ? '#fff' : '#121212',
                    }}
                />
            </IconButton>

            {isAnimating &&
                createPortal(
                    <ExpandingOverlay
                        circlePosition={circlePosition}
                        mode={mode}
                        onAnimationEnd={onAnimationEnd}
                    />,
                    document.body
                )}
        </>
    );
};

export default ThemeToggleButton;
