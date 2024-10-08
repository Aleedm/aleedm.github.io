import {
    AppBar,
    Box,
    Toolbar,
} from "@mui/material";
import ThemeToggleButton from "../Theme/ThemeToggleButton";

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
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <ThemeToggleButton />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Appbar;
