import {
    AppBar,
    Box,
    Toolbar,
} from "@mui/material";
import ThemeToggleButton from "../Theme/ThemeToggleButtonStatic";

const Appbar = () => {

    return (
        <>
            <AppBar
                position="fixed"
                color="transparent"
                elevation={0}
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
