import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Container, Typography, Button, Select, MenuItem, Divider } from '@mui/material';
import HomeCard from '../../sections/@tour/HomeCard';
import { useState, useEffect } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Link from 'next/link';

const HomeCards = [
  {
    icon: '/assets/icons/tour/ic_tick.svg',
    title: 'Todo list',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    button: 'Use template'
  },
  {
    icon: '/assets/icons/tour/ic_music.svg',
    title: 'Music playlist',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    button: 'Use template'
  },
  {
    icon: '/assets/icons/tour/ic_project_m.svg',
    title: 'Project management',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    button: 'Use template'
  },
  {
    icon: '/assets/icons/tour/ic_bug.svg',
    title: 'Bug fixing',
    description: 'Lorem ipsum dolor sit amet consectetur.',
    button: 'Use template'
  },
];

export default function TourView() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState(0);
  const [visibleMask, setVisibleMask] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

   useEffect(() => {
     setWindowWidth(window.innerWidth);
     setWindowHeight(window.innerHeight);

     const closePopup = (e: any) => {
       if (e.target.classList.contains('tour_modal')) {
         handleClose();
         console.log(e)
       }
     };

    //  document.body.addEventListener('click', closePopup);
   }, []);

  const maskProperties = [
    {
      left: {xs: '115px', md: '215px'},
      top: {xs: '150px', md: '150px'},
      radius: {xs: '55px', md: '65px'},
    },
    {
      left: {xs: '115px', md: '325px'},
      top: {xs: '455px', md: '455px'},
      radius: {xs: '65px', md: '65px'},
    },
    {
      left: {xs: `${windowWidth - 96}px`, md: `${windowWidth - 118}px`},
      top: {xs: '24px', md: '24px'},
      radius: {xs: '20px', md: '20px'},
    },
    {
      left: {xs: `${windowWidth - 60}px`, md: `${windowWidth - 82}px`},
      top: {xs: '24px', md: '24px'},
      radius: {xs: '20px', md: '20px'},
    },
    {
      left: {xs: `${windowWidth - 23}px`, md: `${windowWidth - 40}px`},
      top: {xs: '24px', md: '24px'},
      radius: {xs: '20px', md: '20px'},
    },
    {
      left: {xs: '124px', md: '705px'},
      top: {xs: '25px', md: '25px'},
      radius: {xs: '25px', md: '30px'},
    }
  ];

  const [maskProperty, setMaskProperty] = useState(maskProperties[0]);

  const handleClickOpen = () => {
    setOpen(true);
    setVisibleMask(true);
  };

   const handleClose = () => {
     setOpen(false);
     setSteps(0);
     setMaskProperty(maskProperties[0]);
     setVisibleMask(false);
   };

  const goPrevious = () => {
    setSteps(steps - 1);
    setMaskProperty(maskProperties[steps - 1]);
  };

  const goNext = () => {
    setSteps(steps + 1);
    setMaskProperty(maskProperties[steps + 1]);
  };
// --------------------AUTO OPEN TOUR VIEW START----------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true); // set the state to true after 1 second
    }, 1);

    return () => clearTimeout(timer); // clear the timeout on component unmount
  }, []);

  useEffect(() => {
    const button = document.getElementById('tour-button');
    if (isOpen && button) {
      const clickTimer = setTimeout(() => {
        button.click(); // simulate a button click after 1 second
      }, 1);

      return () => clearTimeout(clickTimer); // clear the timeout on component unmount
    }
  }, [isOpen]);


// --------------------AUTO OPEN TOUR VIEW END----------------------------------------------------

  const MaskedBackground = styled('div')(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(84, 166, 251, 0.5)',
    pointerEvents: "none",
    mask: `radial-gradient(circle at ${maskProperty.left.xs} ${maskProperty.top.xs}, transparent ${maskProperty.radius.xs}, black 0)`,
    zIndex: 10000,
    [theme.breakpoints.up('md')]: {
      mask: `radial-gradient(circle at ${maskProperty.left.md} ${maskProperty.top.md}, transparent ${maskProperty.radius.md}, black 0)`,
    },
  }));

  return (
    <>
      <Container sx={{ py: 3, maxWidth: 'inherit !important', overflow: 'auto', height: `${windowHeight - 96}px` }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          You don’t have any lists created yet.
          {/* <Button onClick={handleClickOpen}>Tour</Button> */}
          <Button id="tour-button" onClick={handleClickOpen} disabled={!isOpen}>Tour</Button>
        </Typography>
        <Link href="/coming-soon">
          <Button
            size="medium"
            variant="contained"
          >
            Create list from scratch
          </Button>
        </Link>
        {open &&
        <Box className="tour_modal" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 }}>
          <Box sx={{ width: '600px', backgroundColor: 'white', borderRadius: '10px', p: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>{steps === 1 ? "What industry are you in?" : "How many employees to you have?"}</Typography>
            </Box>            
            <Box>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value="Choose.."
                fullWidth
                sx={{ height: 37 }}
              >
                <MenuItem disabled value="Choose..">Choose..</MenuItem>
              </Select>
              <Divider sx={{ borderStyle: 'solid', my: 2 }} />
              {steps == 1 ?
                <Typography variant="h6" sx={{ mb: 1 }}>Create your list from scratch</Typography>
                : 
                <Typography variant="h6" sx={{ mb: 1 }}>Use one of our many templates</Typography>
              }
              <Typography variant="caption">
                Lorem ipsum dolor sit amet consectetur. Sit platea quis varius in. Morbi ipsum odio eu id eu amet elementum. Adipiscing diam amet quis consequat tellus semper pretium. Condimentum dui pellentesque eget praesent nam dignissim fermentum.
              </Typography>
              <CardMedia
                component='video'
                sx={{ marginTop: '16px' }}
                image={"/assets/video/tour.mp4"}
                controls
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px' }}>
              <Box>
                {steps === 0 ?
                  <Button variant="outlined" size="small" sx={{display: "none"}} >Skip</Button> :
                  <Button variant="contained" size="small" onClick={goPrevious}>Previous</Button>
                }
              </Box>
              <Box>
                {steps === 5 ?
                  <Button variant="outlined" size="small" onClick={handleClose} >Finish</Button> :
                  <Button variant="contained" size="small" onClick={goNext}>Next</Button>
                }
              </Box>
            </Box>
          </Box>  
        </Box>}
        <Typography variant="h6" sx={{ mt: 5, mb: 3 }}>
          Use one of templates
        </Typography>
        <Grid container spacing={3}>
          {HomeCards.map((card: any) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={card.icon}>
                <HomeCard icon={card.icon} title={card.title} description={card.description} button={card.button} link=''></HomeCard>
              </Grid>
            )
          })}
        </Grid>
      </Container>
      {visibleMask && <MaskedBackground />}
    </>
  );
}
