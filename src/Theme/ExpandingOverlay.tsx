import React, { useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

interface ExpandingOverlayProps {
    circlePosition: { x: number; y: number };
    mode: 'dark' | 'light';
    onAnimationEnd: () => void;
}

const ExpandingOverlay: React.FC<ExpandingOverlayProps> = ({ circlePosition, mode, onAnimationEnd }) => {
    const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);

    const expandAnimation = keyframes`
    from {
      clip-path: circle(0% at ${circlePosition.x}px ${circlePosition.y}px);
    }
    to {
      clip-path: circle(${maxRadius}px at ${circlePosition.x}px ${circlePosition.y}px);
    }
  `;

    const Overlay = styled('div')({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundColor: mode === 'dark' ? '#fff' : '#121212',
        animation: `${expandAnimation} 0.8s forwards`,
        zIndex: 9999,
        mixBlendMode: 'revert-layer',
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            onAnimationEnd();
        }, 800);

        return () => clearTimeout(timer);
    }, [onAnimationEnd]);

    return <Overlay />;
};

export default ExpandingOverlay;
