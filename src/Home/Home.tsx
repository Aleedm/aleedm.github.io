import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const Home = () => {

    return (
        <>
            <Box marginTop={10}>
                <Grid container spacing={3}>
                    <Grid size={2}>
                    </Grid>
                    <Grid size={8} alignContent="center">
                        <Paper elevation={3}>
                            <Grid container py={4} px={2}>
                                <Grid size={4}>
                                    Immagine
                                </Grid>
                                <Grid size={8}>
                                    <Typography variant="h3">Alessandro De Marco</Typography>
                                    <Typography variant="h6">AI bla bla</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={2}>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
};

export default Home;
