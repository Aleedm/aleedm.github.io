import {
    AppBar,
    Box,
    Toolbar,
    useTheme,
} from "@mui/material";
import ThemeToggleButton from "../Theme/ThemeToggleButtonStatic";
import { useContext } from "react";
import ThemeContext from "../Theme/ThemeContext";

const Appbar = () => {
    const theme = useTheme();
    const { mode } = useContext(ThemeContext);

    return (
        <>
            <AppBar
                position="fixed"
                color="transparent"
                elevation={0}
                sx={{
                    backgroundImage: `linear-gradient(to bottom, ${theme.palette.mode === 'light'
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(18, 18, 18, 1)'
                        } 20%, rgba(255, 255, 255, 0) 100%)`,
                }}
            >
                <Toolbar>
                    <Box sx={{ flexGrow: 1 }} />
                    <ThemeToggleButton />
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Appbar;
