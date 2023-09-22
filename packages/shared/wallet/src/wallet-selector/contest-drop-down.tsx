import { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { V3BetaIcon, CloseX } from '@notional-finance/icons';
import { Button } from '@notional-finance/mui';
import { useLocation } from 'react-router-dom';
import { Box, styled, Popover, useTheme } from '@mui/material';
import {
  setInLocalStorage,
  getFromLocalStorage,
} from '@notional-finance/helpers';
import { colors } from '@notional-finance/styles';

export function ContestDropdown() {
  const theme = useTheme();
  const { pathname } = useLocation();
  const userSettings = getFromLocalStorage('userSettings');
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const test = document.getElementById('beta-icon');
    if (!userSettings.hideV3Popup && pathname === '/portfolio/overview') {
      setAnchorEl(test);
    }
  }, [userSettings, pathname]);

  const handleClick = (event: any) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setInLocalStorage('userSettings', {
      ...userSettings,
      hideV3Popup: true,
    });
  };

  return (
    <Wrapper>
      <V3BetaIcon
        id="beta-icon"
        onClick={(event: any) => handleClick(event)}
        sx={{
          height: theme.spacing(6.25),
          width: theme.spacing(6.25),
          marginRight: theme.spacing(3),
          cursor: 'pointer',
        }}
      />
      <Popover
        id="basic-menu"
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose()}
        transitionDuration={{ exit: 0, enter: 200 }}
        sx={{
          marginTop: '10px',
          '.MuiPopover-paper': {
            background: '#0A2433',
            boxShadow: theme.shape.shadowLarge(),
            width: {
              xs: '100%',
              sm: '100%',
              md: '926px',
              lg: '926px',
              xl: '926px',
            },
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <InnerWrapper>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Title>
                <FormattedMessage defaultMessage={'V3 BETA CONTEST'} />
              </Title>
              <Text>
                Click here to view the contest leader board and your position.
              </Text>
              <SubText>
                Once you transact in the V3 beta, you'll automatically be
                entered in the competition.
              </SubText>
            </Box>
            <CloseX
              onClick={() => handleClose()}
              sx={{
                cursor: 'pointer',
                stroke: colors.neonTurquoise,
                marginTop: theme.spacing(1),
              }}
            />
          </Box>
          <ButtonContainer>
            <Button
              size="large"
              sx={{
                marginBottom: theme.spacing(3),
                width: '358px',
                fontFamily: 'Avenir Next',
                cursor: 'pointer',
                background: colors.neonTurquoise,
                color: colors.black,
                ':hover': {
                  background: colors.white,
                },
              }}
              onClick={() => handleClose()}
            >
              <FormattedMessage defaultMessage={'Start Earning'} />
            </Button>
            <Button
              size="large"
              variant="outlined"
              to="/contest-leaderboard"
              sx={{
                width: '358px',
                border: `1px solid ${colors.neonTurquoise}`,
                cursor: 'pointer',
                color: colors.neonTurquoise,
                ':hover': {
                  background: colors.matteGreen,
                },
                fontFamily: 'Avenir Next',
              }}
            >
              <FormattedMessage
                defaultMessage={'See leaderboard / Rules & Prizes'}
              />
            </Button>
          </ButtonContainer>
        </InnerWrapper>
      </Popover>
    </Wrapper>
  );
}

const ButtonContainer = styled(Box)(
  ({ theme }) => `
  margin-top: ${theme.spacing(5)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  ${theme.breakpoints.down('md')} {
    align-items: center;
    flex-direction: column;
  }
  `
);

const Wrapper = styled(Box)(
  ({ theme }) => `
    margin-left: ${theme.spacing(2.5)};
    ${theme.breakpoints.down('md')} {
      display: none;
    }
  `
);

const Title = styled(Box)(
  ({ theme }) => `
  font-family: Avenir Next;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 10px;
  color: ${colors.white};
  margin-bottom: ${theme.spacing(8)};
  `
);

const Text = styled(Box)(
  ({ theme }) => `
  font-family: Avenir Next;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${colors.white};
  margin-bottom: ${theme.spacing(3)};
  `
);

const SubText = styled(Box)(
  `
  font-family: Avenir Next;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: ${colors.lightGrey};
  `
);

const InnerWrapper = styled(Box)(
  ({ theme }) => `
    width: 100%;
    padding: ${theme.spacing(10)};
    padding-top: ${theme.spacing(8)};
    border: 1px solid ${colors.neonTurquoise};
    ${theme.breakpoints.down('sm')} {
      width: 100%;
      padding: ${theme.spacing(1)};
    }
  `
);

export default ContestDropdown;