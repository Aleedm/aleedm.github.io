import { Avatar, Backdrop, Box, Divider, Link, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ThemeContext from '../Theme/ThemeContext';
import { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { trackEvent } from './utils';
import QuiltedImageList from './images';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { LAST_UPDATED } from '../config';
const HomePhone = ({ unit }: { unit: string }) => {
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

    return (
        <>
            <Box marginTop={3}>
                <Grid container>
                    <Grid size={1}>
                    </Grid>
                    <Grid size={10} alignContent="center" px={2}>
                        <Paper elevation={0}>
                            <Grid container>
                                <Grid size={12} >
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
                                                // top: '50%',
                                                transform: 'translateY(-50%)',
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                // objectPosition: '50% 10%',
                                                borderRadius: '50%'
                                            }}
                                            loading="lazy"
                                            alt=""
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={12} pt={2} pb={1}>
                                    <Typography variant="h3" align="center">Alessandro De Marco</Typography>
                                    <Typography align='center' variant="body2" color='gray'>[<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm" color="textDisabled">GitHub</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="mailto:alessandrodemarco.1237@gmail.com" color="textDisabled">Mail</Link>] [<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.linkedin.com/in/aleedm/" color="textDisabled">LinkedIn</Link>]</Typography>
                                </Grid>
                                <Grid size={12} pb={2}>
                                    <Typography variant="body1" align='justify'>I am a final-year graduate student in Artificial Intelligence and Data Analytics at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/en">Politecnico di Torino</Link>.
                                        I conducted my Master's thesis project at <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://ethz.ch/en.html">ETH Zurich</Link>, working on robot navigation and exploration at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://pbl.ee.ethz.ch/">Center for Project-Based Learning D-ITET </Link> 
                                        under the supervision of <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=vBBJ2wkAAAAJ&hl=it">Prof. Raffaello Camoriano</Link>, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=ytj7UUcAAAAJ&hl=en">Prof. Michele Magno</Link> and PhD students <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=X8rYlhIAAAAJ&hl=en">Davide Plozza</Link>, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=mm7B7UwAAAAJ&hl=en">Liam Boyle</Link> and <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.com/citations?user=NRmcxZgAAAAJ&hl=de">Maurice Brunner</Link>.
                                        During my graduate studies, I worked as a researcher at the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, under the supervision of <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://scholar.google.it/citations?user=MNw82SUAAAAJ&hl=it">Prof. Claudio Schifanella</Link>.
                                        Previously, I received my Bachelor's degree in Computer Science from the <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>.</Typography>
                                </Grid>
                                <Grid size={12} py={2}>
                                    <Typography align='justify'>I'm from a stunning corner of Italy called <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} color="textSecondary" onClick={handleOpenImages}>Salento</Link>, where the sun, sea, and wind (lu sule, lu mare, lu ientu) are basically part of our DNA. True to the stereotype, I’m into just about everything: I’ve tried surfing, kite surfing, and snowboarding, and I’ve mastered the art of gracefully wiping out and getting back up. I also have a love for running, hiking and climbing. Below, you’ll see an excellent example of my skills in action!</Typography>
                                </Grid>

                                <Grid size={12} pt={2}>
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
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '60px',
                                                height: '60px',
                                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                borderRadius: '50%',
                                            }}
                                            onClick={handleOpenGif}
                                        >
                                            <PlayArrowIcon sx={{ color: 'white', fontSize: 40 }} />
                                        </Box>
                                    </Box>
                                </Grid>

                                <Backdrop
                                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', })}
                                    open={openGif}
                                    onClick={handleCloseGif}
                                >
                                    <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100vh' }} spacing={3}>
                                        <Grid size={12}>
                                            <Typography variant='h5' align='center' color='white'>
                                                This is how to break your ankle from just 10 {unit} off the ground!
                                            </Typography>
                                        </Grid>
                                        <Grid size={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src='/falling_down.gif'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    maxHeight: 450,
                                                    maxWidth: 450,
                                                }}
                                                loading="lazy"
                                                alt=""
                                            />
                                        </Grid>
                                        <Typography variant='h5' align='center' color='white'>
                                            Animated by yours truly while waiting for the doc to put me in a cast!
                                        </Typography>
                                    </Grid>
                                </Backdrop>
                                <Backdrop
                                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', })}
                                    open={openImages}
                                    onClick={handleCloseImages}
                                >
                                    <QuiltedImageList itemForCols={3} />
                                </Backdrop>

                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid container size={12} direction="column" alignItems="center">
                                    <Grid size={12}>
                                        <Typography variant="h4" align="center">Projects</Typography>
                                    </Grid>
                                    <Grid size={12} pt={2}>
                                        <Typography variant='h5'>
                                            Glomeruli Identification and Necrosis State Classification
                                        </Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Box
                                                component="img"
                                                src="/glomeruli.png"
                                                sx={{
                                                    width: 300,
                                                    maxHeight: 150,
                                                    maxWidth: 300,
                                                    height: "auto",
                                                    objectFit: 'scale-down',
                                                    '&:hover': {
                                                        content: 'url(/glo_classification.png)',
                                                    },
                                                }}
                                                loading="lazy"
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='body1' align='justify'>
                                            In this project, I applied convolutional neural networks to segment histological images of kidney tissue, implementing SegNet and U-Net for precise identification of glomeruli and using feature extraction methods by autoencoder, VGG-19, and ResNet50, followed by unsupervised clustering to classify them according to their Necrosis status". <br />
                                            {"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/GlomeruLearn-Advanced-Deep-Learning-for-Kidney-Tissue-Analysis">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf">Paper</Link>{"]"}
                                        </Typography>
                                    </Grid>


                                    <Grid size={12} pt={2}>
                                        <Typography variant='h5'>Real-time Domain Adaptation in Semantic Segmentation</Typography>
                                    </Grid>
                                    <Grid size={12}>

                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                        >
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
                                        </Box>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='body1' align='justify'>
                                            I developed a real-time domain adaptation method for semantic segmentation using the Short-Term Dense Concatenate (STDC) network, optimizing efficiency and addressing the domain shift between synthetic (GTA5) and real (Cityscapes) datasets through adversarial learning.<br />
                                            {"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation/blob/main/paper.pdf">Paper</Link>{"]"}
                                        </Typography>
                                    </Grid>
                                    <Grid size={12} pt={2}>
                                        <Typography variant='h5'>Commonsense Knowledge in Dialogue Summarization</Typography>
                                    </Grid>
                                    <Grid size={12}>
                                        <Typography variant='body1' align='justify'>
                                            I explored the effectiveness of enrichment with commonsense knowledge into abstractive dialogue summarization by comparing different language models (T5, BART, PEGASUS) on datasets such as DialogSum, SamSum, and TweetSumm. The results highlight how advanced use of the SICK++ model improves the quality of summaries, especially in real-world contexts such as customer service conversations on Twitter.<br />
                                            {"["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Real-time-Domain-Adaptation-in-Semantic-Segmentation">GitHub</Link>{"]"}{" ["}<Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://github.com/Aleedm/Sick-Summarization/blob/main/paper.pdf">Paper</Link>{"]"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid container size={12} direction="column" alignItems="center">
                                    <Grid size={12}>
                                        <Typography variant="h4" align="center">Teaching Experiences</Typography>
                                    </Grid>
                                    <Box display="flex" alignItems="center" pt={2}>
                                        <a href='https://en.unito.it/'><Avatar src='/logoUnito.svg' sx={{ marginRight: 2, width: 56, height: 56 }} sizes="large" /></a>
                                        <Typography variant="subtitle1" display="inline" align='justify'>
                                            Teacher, <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.mastercybersecuritytorino.it">Master in Cybersecurity</Link> - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link>, 2024
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" align='justify' color="textDisabled">
                                        Delivered lectures on IPFS's role in blockchain technology. Covered essential blockchain security topics and explored decentralized finance (DeFi).
                                    </Typography>


                                    <Box display="flex" alignItems="center" pt={2}>
                                        <a href='https://www.itiscuneo.edu.it/'><Avatar src={mode === "dark" ? '/itisW.svg' : '/itisD.svg'} sx={{ marginRight: 2, width: 56, height: 56 }} sizes="large" /></a>
                                        <Typography variant="subtitle1" display="inline" align='justify'>
                                            Teacher, Lecture on Decentralized Systems - <Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.itiscuneo.edu.it/">I.T.I.S. 'Mario Delpozzo'</Link>, Cuneo, 2023
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" align='justify' color="textDisabled">
                                        Conducted a series of lectures on Blockchain technology, imparting knowledge on its practical applications and potential impact on future technologies
                                    </Typography>
                                </Grid>
                                <Grid size={12} py={4}>
                                    <Divider variant='middle' />
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h4" align="center">Education</Typography>
                                </Grid>
                                {/* <Grid container size={12} spacing={4} justifyContent="center" alignItems="center" pt={2} pb={4}>
                                    <Grid size={4} container direction="column" alignItems="center">
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://ethz.ch/en.html">
                                                <img
                                                    src={mode === 'dark' ? '/eth_logo_kurz_neg.svg' : '/eth_logo_kurz_pos.svg'}
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="Politecnico di Torino Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center">
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://www.polito.it/en">
                                                <img
                                                    src={mode === 'dark' ? '/logoPoliW.svg' : '/logoPoliD.svg'}
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="Politecnico di Torino Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                    </Grid>

                                    <Grid size={4} container direction="column" alignItems="center">
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <a href="https://en.unito.it/">
                                                <img
                                                    src='/logoUnito.svg'
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="University of Turin Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>

                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle2" align="center">Project Mobility Student</Typography>
                                        <Typography variant="subtitle2" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://ethz.ch/en.html">ETH Zurich</Link></Typography>
                                        <Typography variant="caption" align="center">March. 2025 - Present</Typography>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle2" align="center">Graduate student in Artificial Intelligence</Typography>
                                        <Typography variant="subtitle2" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://www.polito.it/">Politecnico di Torino</Link></Typography>
                                        <Typography variant="caption" align="center">Sept. 2022 - Present</Typography>
                                    </Grid>
                                    <Grid size={4} container direction="column" alignItems="center" spacing={0}>
                                        <Typography variant="subtitle2" align="center">B.Sc. in Computer Science</Typography>
                                        <Typography variant="subtitle2" align="center"><Link underline="hover" sx={{ color: theme.palette.primary.main, '&:hover': { color: theme.palette.secondary.dark } }} href="https://en.unito.it/">University of Turin</Link></Typography>
                                        <Typography variant="caption" align="center">Sept. 2019 - July 2022</Typography>
                                    </Grid>
                                </Grid> */}
                                <Grid
                                    size={12}
                                    container
                                    direction="column" alignItems="center"
                                >
                                    {/* ETH Zurich */}
                                    <Grid size={12} container direction="column" alignItems="center" spacing={1}>
                                        {/* Logo */}
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <a href="https://ethz.ch/en.html">
                                                <img
                                                    src={mode === 'dark' ? '/eth_logo_kurz_neg.svg' : '/eth_logo_kurz_pos.svg'}
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="ETH Zurich Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                        {/* Testo */}
                                        <Typography variant="subtitle2" align="center">
                                            Project Mobility Student
                                        </Typography>
                                        <Typography variant="subtitle2" align="center">
                                            <Link
                                                underline="hover"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    '&:hover': { color: theme.palette.secondary.dark }
                                                }}
                                                href="https://ethz.ch/en.html"
                                            >
                                                ETH Zurich
                                            </Link>
                                        </Typography>
                                        <Typography variant="caption" align="center">
                                            March 2025 - August 2025
                                        </Typography>
                                    </Grid>
                                    <Grid size={12} py={2} px={10}> 
                                        <Divider variant='middle' />
                                    </Grid>


                                    {/* Politecnico di Torino */}
                                    <Grid size={12} container direction="column" alignItems="center" spacing={1}>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <a href="https://www.polito.it/en">
                                                <img
                                                    src={mode === 'dark' ? '/logoPoliW.svg' : '/logoPoliD.svg'}
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="Politecnico di Torino Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                        <Typography variant="subtitle2" align="center">
                                            Graduate student in Artificial Intelligence
                                        </Typography>
                                        <Typography variant="subtitle2" align="center">
                                            <Link
                                                underline="hover"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    '&:hover': { color: theme.palette.secondary.dark }
                                                }}
                                                href="https://www.polito.it/"
                                            >
                                                Politecnico di Torino
                                            </Link>
                                        </Typography>
                                        <Typography variant="caption" align="center">
                                            Sept. 2022 - Present
                                        </Typography>
                                    </Grid>
                                    <Grid size={12} py={2} px={10}> 
                                        <Divider variant='middle' />
                                    </Grid>
                                    {/* University of Turin */}
                                    <Grid size={12} container direction="column" alignItems="center" spacing={1}>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <a href="https://en.unito.it/">
                                                <img
                                                    src="/logoUnito.svg"
                                                    style={{ width: '100px', height: '100px' }}
                                                    alt="University of Turin Logo"
                                                    loading="lazy"
                                                />
                                            </a>
                                        </Box>
                                        <Typography variant="subtitle2" align="center">
                                            B.Sc. in Computer Science
                                        </Typography>
                                        <Typography variant="subtitle2" align="center">
                                            <Link
                                                underline="hover"
                                                sx={{
                                                    color: theme.palette.primary.main,
                                                    '&:hover': { color: theme.palette.secondary.dark }
                                                }}
                                                href="https://en.unito.it/"
                                            >
                                                University of Turin
                                            </Link>
                                        </Typography>
                                        <Typography variant="caption" align="center">
                                            Sept. 2019 - July 2022
                                        </Typography>
                                    </Grid>
                                    <Grid size={12} py={2} px={10}> 
                                        <Divider variant='middle' />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid >
                    <Grid size={1}>
                    </Grid>
                    <Grid size={12} py={2} container direction="column">
                        <Typography variant='caption' align='center' color='textSecondary'>Last updated: {LAST_UPDATED}</Typography>
                    </Grid>
                </Grid >
            </Box >
        </>
    );
};

export default HomePhone;
