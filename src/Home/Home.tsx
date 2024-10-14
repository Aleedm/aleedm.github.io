import { Avatar, Box, Divider, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ThemeContext from '../Theme/ThemeContext';
import { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
const Home = () => {
    const theme = useTheme();
    const { mode } = useContext(ThemeContext);
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    return (
        <>
            <Box marginTop={10}>
                <Grid container spacing={3}>
                    <Grid size={2}>
                    </Grid>
                    <Grid size={8} alignContent="center">
                        <Paper
                            elevation={0}
                        >
                            <Grid container>
                                <Grid size={4} py={6} px={6}>
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        width="100%"
                                        height="0"
                                        paddingTop="100%"
                                        position="relative"
                                    >
                                        <img
                                            src='/me.jpg'
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: '50% 10%',
                                                borderRadius: '50%'
                                            }}
                                            alt=""
                                        />
                                    </Box>
                                </Grid>
                                {isMd ?
                                    <>
                                        <Grid size={8} pt={8} px={4}>
                                            <Typography variant="h3">Alessandro De Marco</Typography>
                                            <Typography variant="body2" color='gray'>[<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm" color="textSecondary">GitHub</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="mailto:alessandrodemarco.1237@gmail.com" color="textSecondary">Mail</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.linkedin.com/in/aleedm/" color="textSecondary">LinkedIn</Link>]</Typography>
                                        </Grid>
                                        <Grid size={12} pb={8} px={4}>
                                            <Typography variant="body1">I am a final-year graduate student in Artificial Intelligence and Data Analytics at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/">Politecnico di Torino</Link>. Additionally, I am a graduate researcher at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, working with <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.it/citations?user=MNw82SUAAAAJ&hl=it">Prof. Claudio Schifanella</Link>. Before that, I received my bachelor's degree in Computer Science from the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>.</Typography>
                                        </Grid>
                                    </>
                                    :
                                    <Grid size={8} py={8} px={4}>
                                        <Typography variant="h3">Alessandro De Marco</Typography>
                                        <Typography variant="body2" color='gray'>[<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm" color="textSecondary">GitHub</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="mailto:alessandrodemarco.1237@gmail.com" color="textSecondary">Mail</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.linkedin.com/in/aleedm/" color="textSecondary">LinkedIn</Link>]</Typography>
                                        <Typography variant="body1" align='justify'>I am a final-year graduate student in Artificial Intelligence and Data Analytics at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/">Politecnico di Torino</Link>. Additionally, I am a graduate researcher at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, working with <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.it/citations?user=MNw82SUAAAAJ&hl=it">Prof. Claudio Schifanella</Link>. Before that, I received my bachelor's degree in Computer Science from the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>.</Typography>
                                    </Grid>}

                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid size={12} pl={8}>
                                    <Typography variant="h4">Projects</Typography>
                                    <List>
                                        <ListItem alignItems="flex-start">
                                            <Box
                                                component="img"
                                                src="/glomeruli.png"
                                                sx={{
                                                    width: 300,
                                                    maxHeight: 150,
                                                    maxWidth: 300,
                                                    height: "auto",
                                                    marginRight: 2,
                                                    objectFit: 'scale-down',
                                                    '&:hover': {
                                                        content: 'url(/glo_classification.png)',
                                                    },
                                                }}
                                            />
                                            <ListItemText primary="Glomeruli Identification and Necrosis State Classification"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">In this project, I applied convolutional neural networks to segment histological images of kidney tissue, implementing SegNet and U-Net for precise identification of glomeruli and using feature extraction methods by autoencoder, VGG-19, and ResNet50, followed by unsupervised clustering to classify them according to their Necrosis status". <br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf">Paper</Link>{"]"}</Typography>} />
                                        </ListItem>
                                        <ListItem alignItems="flex-start">
                                            <Box
                                                component="img"
                                                src="/all.png"
                                                sx={{
                                                    width: 300,
                                                    maxHeight: 150,
                                                    maxWidth: 300,
                                                    height: "auto",
                                                    marginRight: 2,
                                                    objectFit: 'scale-down',
                                                    '&:hover': {
                                                        content: 'url(/gan.png)',
                                                    },
                                                }}
                                            />
                                            <ListItemText primary="Real-time Domain Adaptation in Semantic Segmentation"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">I developed a real-time domain adaptation method for semantic segmentation using the Short-Term Dense Concatenate (STDC) network, optimizing efficiency and addressing the domain shift between synthetic (GTA5) and real (Cityscapes) datasets through adversarial learning.<br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf">Paper</Link>{"]"}</Typography>} />
                                        </ListItem>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText primary="Commonsense Knowledge in Dialogue Summarization"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">I explored the effectiveness of enrichment with commonsense knowledge into abstractive dialogue summarization by comparing different language models (T5, BART, PEGASUS) on datasets such as DialogSum, SamSum, and TweetSumm. The results highlight how advanced use of the SICK++ model improves the quality of summaries, especially in real-world contexts such as customer service conversations on Twitter.<br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Sick-Summarization/blob/main/paper.pdf">Paper</Link>{"]"}</Typography>} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid size={12} pl={8}>
                                    <Typography variant="h4">Teaching Experiences</Typography>
                                    <List>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar><Avatar src='/logoUnito.svg' /></ListItemAvatar>
                                            <ListItemText primary={<>
                                                <Typography variant="subtitle1" align='justify'>
                                                    Teacher, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.mastercybersecuritytorino.it">Master in Cybersecurity</Link> - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, 2024
                                                </Typography></>}
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">Delivered lectures on IPFS's role in blockchain technology. Covered essential blockchain security topics and explored decentralized finance (DeFi).</Typography>} />
                                        </ListItem>
                                    </List>
                                    <List>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>{mode === "dark" ? <Avatar src='/itisW.svg' /> : <Avatar src='/itisD.svg' />}</ListItemAvatar>
                                            <ListItemText primary={<>
                                                <Typography variant="subtitle1" align='justify'>
                                                    Teacher, Lecture on Decentralized Systems - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.itiscuneo.edu.it/">I.T.I.S. 'Mario Delpozzo'</Link>, Cuneo, 2023
                                                </Typography></>}
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">Conducted a series of lectures on Blockchain technology, imparting knowledge on its practical applications and potential impact on future technologies"</Typography>} />
                                        </ListItem>
                                    </List>
                                </Grid>
                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid size={12} pl={8}>
                                    <Typography variant="h4">Education</Typography>
                                </Grid>
                                <Grid container size={12} spacing={4} py={5} justifyContent="center" alignItems="center">
                                    <Grid size={6} container direction="column" alignItems="center" spacing={2}>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <img
                                                src={mode === 'dark' ? '/logoPoliW.svg' : '/logoPoliD.svg'}
                                                style={{ width: '150px', height: '150px' }}
                                                alt="Politecnico di Torino Logo"
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid size={6} container direction="column" alignItems="center" spacing={2}>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <img
                                                src='/logoUnito.svg'
                                                style={{ width: '150px', height: '150px' }}
                                                alt="University of Turin Logo"
                                            />
                                        </Box>

                                    </Grid>
                                    <Grid size={6} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle1" align="center">Graduate student in Artificial Intelligence</Typography>
                                        <Typography variant="subtitle1" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/">Politecnico di Torino</Link></Typography>
                                        <Typography variant="caption" align="center">Sept. 2022 - Present</Typography>
                                    </Grid>
                                    <Grid size={6} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle1" align="center">B.Sc. in Computer Science</Typography>
                                        <Typography variant="subtitle1" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link></Typography>
                                        <Typography variant="caption" align="center">Sept. 2019 - July 2022</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid size={2}>
                    </Grid>
                </Grid >
            </Box >
        </>
    );
};

export default Home;
