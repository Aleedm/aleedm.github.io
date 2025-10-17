import { Avatar, Backdrop, Box, Divider, Link, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ThemeContext from '../Theme/ThemeContext';
import { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { trackEvent } from './utils';
import QuiltedImageList from './images';
import { LAST_UPDATED } from '../config';

const Home = ({ unit }: { unit: string }) => {
    const [openGif, setOpenGif] = useState(false);
    const [openImages, setOpenImages] = useState(false);

    const handleCloseGif = () => {
        setOpenGif(false);
        document.body.style.overflow = 'auto';
        document.body.style.cursor = 'default';
    };
    const handleOpenGif = () => {
        trackEvent('boulder');
        setOpenGif(true);
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'pointer';
    };
    const handleCloseImages = () => {
        setOpenImages(false);
        document.body.style.overflow = 'auto';
        document.body.style.cursor = 'default';
    };
    const handleOpenImages = () => {
        trackEvent('salento');
        setOpenImages(true);
        document.body.style.overflow = 'hidden';
        document.body.style.cursor = 'pointer';
    };
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
                                <Grid size={4} pt={6} pb={2} px={6}>
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
                                            loading="lazy"
                                            alt=""
                                        />
                                    </Box>
                                </Grid>
                                {isMd ?
                                    <>
                                        <Grid size={8} pt={8} pb={4} px={4}>
                                            <Typography variant="h3">Alessandro De Marco</Typography>
                                            <Typography variant="body2" color='gray'>[<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm" color="textSecondary">GitHub</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="mailto:alessandrodemarco.1237@gmail.com" color="textSecondary">Mail</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.linkedin.com/in/aleedm/" color="textSecondary">LinkedIn</Link>]</Typography>
                                        </Grid>
                                        <Grid size={12} pb={4} px={4}>
                                            <Typography variant="body1">I am a final-year graduate student in Artificial Intelligence and Data Analytics at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/en">Politecnico di Torino</Link>. During my graduate studies, I worked as a researcher at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, under the supervision of <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.it/citations?user=MNw82SUAAAAJ&hl=it">Prof. Claudio Schifanella</Link>. Previously, I received my Bachelor's degree in Computer Science from the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>.</Typography>
                                        </Grid>
                                        <Grid container size={12}>
                                            <Grid size={8} pb={4} pt={1} px={4}>
                                                <Typography align='justify'>I'm from a stunning corner of Italy called <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} color="textSecondary" onClick={handleOpenImages}>Salento</Link>, where the sun, sea, and wind (lu sule, lu mare, lu ientu) are basically part of our DNA. True to the stereotype, I’m into just about everything: I’ve tried surfing, kite surfing, and snowboarding, and I’ve mastered the art of gracefully wiping out and getting back up. I also have a love for hiking and climbing. On the right, you’ll see an excellent example of my skills in action!</Typography>
                                            </Grid>
                                            <Grid size={4} py={2} px={6}>
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
                                                        src='/falling_down.jpg'
                                                        style={{
                                                            position: 'absolute',
                                                            // top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            // objectPosition: '50% 10%',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer'
                                                        }}
                                                        alt=""
                                                        onMouseOver={(e) => e.currentTarget.src = '/falling_down.gif'}
                                                        onMouseOut={(e) => e.currentTarget.src = '/falling_down.jpg'}
                                                        onClick={handleOpenGif}
                                                        loading="lazy"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </>
                                    : <>
                                        <Grid size={8} pt={8} pb={2} px={4}>
                                            <Typography variant="h3">Alessandro De Marco</Typography>
                                            <Typography variant="body2" color='gray'>[<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm" color="textSecondary">GitHub</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="mailto:alessandrodemarco.1237@gmail.com" color="textSecondary">Mail</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.linkedin.com/in/aleedm/" color="textSecondary">LinkedIn</Link>]</Typography>
                                            <Typography variant="body1" align='justify'>I am a final-year graduate student in Artificial Intelligence and Data Analytics at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/en">Politecnico di Torino</Link>. 
                                            I conducted my Master's thesis project at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://ethz.ch/en.html">ETH Zurich</Link>, working on robot navigation and exploration at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://pbl.ee.ethz.ch/">Center for Project-Based Learning D-ITET </Link> 
                                            under the supervision of <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=vBBJ2wkAAAAJ&hl=it">Prof. Raffaello Camoriano</Link>, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=ytj7UUcAAAAJ&hl=en">Prof. Michele Magno</Link> and PhD students <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=X8rYlhIAAAAJ&hl=en">Davide Plozza</Link>, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=mm7B7UwAAAAJ&hl=en">Liam Boyle</Link> and <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=NRmcxZgAAAAJ&hl=de">Maurice Brunner</Link>.
                                            During my graduate studies, I worked as a researcher at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, under the supervision of <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.it/citations?user=MNw82SUAAAAJ&hl=it">Prof. Claudio Schifanella</Link>. 
                                            Previously, I received my Bachelor's degree in Computer Science from the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>.</Typography>
                                        </Grid>
                                        <Grid container size={12}>
                                            <Grid size={8} pb={8} pt={8} px={4}>
                                                <Typography align='justify'>I'm from a stunning corner of Italy called <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} color="textSecondary" onClick={handleOpenImages}>Salento</Link>, where the sun, sea, and wind (lu sule, lu mare, lu ientu) are basically part of our DNA. True to the stereotype, I’m into just about everything: I’ve tried surfing, kite surfing, and snowboarding, and I’ve mastered the art of gracefully wiping out and getting back up. I also have a love for running, hiking and climbing. On the right, you’ll see an excellent example of my skills in action!</Typography>

                                            </Grid>
                                            <Grid size={4} py={2} px={6}>
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
                                                        src='/falling_down.jpg'
                                                        style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            objectPosition: '50% 10%',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer'
                                                        }}
                                                        alt=""
                                                        onMouseOver={(e) => e.currentTarget.src = '/falling_down.gif'}
                                                        onMouseOut={(e) => e.currentTarget.src = '/falling_down.jpg'}
                                                        onClick={handleOpenGif}
                                                        loading="lazy"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </>}
                                <Backdrop
                                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', })}
                                    open={openGif}
                                    onClick={handleCloseGif}
                                >
                                    <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100vh' }} spacing={3}>
                                        <Grid size={12}>
                                            <Typography variant='h4' align='center' color='white'>
                                                This is how to break your ankle from just 10 {unit} off the ground!
                                            </Typography>
                                        </Grid>
                                        <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src='/falling_down.gif'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    maxHeight: 550,
                                                    maxWidth: 550,
                                                }}
                                                loading="lazy"
                                                alt=""
                                            />
                                        </Grid>
                                        <Typography variant='h4' align='center' color='white'>
                                            Animated by yours truly while waiting for the doc to put me in a cast!
                                        </Typography>
                                    </Grid>
                                </Backdrop>

                                <Backdrop
                                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', })}
                                    open={openImages}
                                    onClick={handleCloseImages}
                                >
                                    <QuiltedImageList />
                                </Backdrop>

                                <Grid size={12} pt={2} pb={4}>
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
                                                loading="lazy"
                                            />
                                            <ListItemText primary="Glomeruli Identification and Necrosis State Classification"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">In this project, I applied convolutional neural networks to segment histological images of kidney tissue, implementing SegNet and U-Net for precise identification of glomeruli and using feature extraction methods by autoencoder, VGG-19, and ResNet50, followed by unsupervised clustering to classify them according to their Necrosis status. <br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis/blob/main/Report.pdf">Paper</Link>{"]"}</Typography>} />
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
                                                loading="lazy"
                                            />
                                            <ListItemText primary="Real-time Domain Adaptation in Semantic Segmentation"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">I developed a real-time domain adaptation method for semantic segmentation using the Short-Term Dense Concatenate (STDC) network, optimizing efficiency and addressing the domain shift between synthetic (GTA5) and real (Cityscapes) datasets through adversarial learning.<br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf">Paper</Link>{"]"}</Typography>} />
                                        </ListItem>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText primary="Commonsense Knowledge in Dialogue Summarization"
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">I explored the effectiveness of enrichment with commonsense knowledge into abstractive dialogue summarization by comparing different language models (T5, BART, PEGASUS) on datasets such as DialogSum, SamSum, and TweetSumm. The results highlight how advanced use of the SICK++ model improves the quality of summaries, especially in real-world contexts such as customer service conversations on Twitter.<br />{"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Sick-Summarization">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Sick-Summarization/blob/main/paper.pdf">Paper</Link>{"]"}</Typography>} />
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
                                            <ListItemAvatar><a href='https://en.unito.it/'><Avatar src='/logoUnito.svg' /></a></ListItemAvatar>
                                            <ListItemText primary={<>
                                                <Typography variant="subtitle1" align='justify'>
                                                    Lecturer, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.mastercybersecuritytorino.it">Master in Cybersecurity</Link> - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, 2024
                                                </Typography></>}
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">Delivered lectures on IPFS's role in blockchain technology. Covered essential blockchain security topics and explored decentralized finance (DeFi).</Typography>} />
                                        </ListItem>
                                    </List>
                                    <List>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar><a href='https://www.itiscuneo.edu.it/'>{mode === "dark" ? <Avatar src='/itisW.svg' /> : <Avatar src='/itisD.svg' />}</a></ListItemAvatar>
                                            <ListItemText primary={<>
                                                <Typography variant="subtitle1" align='justify'>
                                                    Teacher, Lecture on Decentralized Systems - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.itiscuneo.edu.it/">I.T.I.S. 'Mario Delpozzo'</Link>, Cuneo, 2023
                                                </Typography></>}
                                                secondary={<Typography variant="body2" align='justify' color="textSecondary">Conducted a series of lectures on Blockchain technology, imparting knowledge on its practical applications and potential impact on future technologies</Typography>} />
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
                                    <Grid size={4} container direction="column" alignItems="center" spacing={2}>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://ethz.ch/en.html">
                                                <img
                                                    src={mode === 'dark' ? '/eth_logo_kurz_neg.svg' : '/eth_logo_kurz_pos.svg'}
                                                    style={{ width: '150px', height: '150px' }}
                                                    alt="ETH Zurich Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={2}>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://www.polito.it/en">
                                                <img
                                                    src={mode === 'dark' ? '/logoPoliW.svg' : '/logoPoliD.svg'}
                                                    style={{ width: '150px', height: '150px' }}
                                                    alt="Politecnico di Torino Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                    </Grid>

                                    <Grid size={4} container direction="column" alignItems="center" spacing={2}>
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://en.unito.it/">
                                                <img
                                                    src='/logoUnito.svg'
                                                    style={{ width: '150px', height: '150px' }}
                                                    alt="University of Turin Logo"
                                                    loading="lazy"

                                                />
                                            </a>
                                        </Box>

                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle1" align="center">Project Mobility Student</Typography>
                                        <Typography variant="subtitle1" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://ethz.ch/en.html">ETH Zurich</Link></Typography>
                                        <Typography variant="caption" align="center">March 2025 - August 2025</Typography>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle1" align="center">Graduate student in Artificial Intelligence</Typography>
                                        <Typography variant="subtitle1" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/en">Politecnico di Torino</Link></Typography>
                                        <Typography variant="caption" align="center">Sept. 2022 - Present</Typography>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
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
                    <Grid size={12} py={2} container direction="column">
                        <Typography variant='caption' align='center' color='textSecondary'>Last updated: {LAST_UPDATED}</Typography>
                    </Grid>
                </Grid >
            </Box >
        </>
    );
};

export default Home;
