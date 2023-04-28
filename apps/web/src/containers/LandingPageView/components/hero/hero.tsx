import { Player } from '@lottiefiles/react-lottie-player';
import { styled, Box } from '@mui/material';
import { HeroContent, HeroStats } from './components';
import backgroundImg from './images/background.svg';
import HeroAnimationTwo from './images/data-two.json';

export const Hero = () => {
  return (
    <HeroContainer>
      <Player
        autoplay
        loop
        id="lottie-player"
        src={HeroAnimationTwo}
        style={{
          minWidth: `100vw`,
          maxHeight: '100vh',
          height: '100%',
          paddingTop: '1px',
          background:
            'linear-gradient(259.11deg, #004453 5.12%, #002129 99.67%)',
        }}
      />
      <Container>
        <HeroContent />
        <HeroStats />
      </Container>
    </HeroContainer>
  );
};

const HeroContainer = styled(Box)(
  ({ theme }) => `
  ${theme.breakpoints.down('smLanding')} {
    #lottie-player {
      display: none;
    }
    background: url(${backgroundImg}) no-repeat;
    background-size: 100% 100%;
    height: 100%;
    min-height: ${theme.spacing(100)};
    min-width: 100vw;
    background-color: ${theme.palette.background.paper};
    overflow: hidden;
    ${theme.breakpoints.down('md')} {
      background-size: 100% 100%;
      min-height: ${theme.spacing(180)};
    }
    ${theme.breakpoints.down('sm')} {
      min-height: ${theme.spacing(180)};
    }
  }
`
);

const Container = styled(Box)(
  ({ theme }) => `
  display: flex;
  position: absolute;
  top: ${theme.spacing(9)};
  justify-content: space-between;
  left: 0;
  width: 100%;
  ${theme.breakpoints.down('smLanding')} {
    flex-direction: column;
  }
  `
);

export default Hero;
