import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { initPlausible } from '@notional-finance/helpers';
import { getFromLocalStorage } from '@notional-finance/helpers';
import Plausible from 'plausible-tracker';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { useUserSettingsState } from '@notional-finance/user-settings-manager';
import { useNotionalTheme } from '@notional-finance/styles';
import { App } from './App';

const applicationId = process.env['NX_DD_APP_ID'] as string;
const clientToken = process.env['NX_DD_API_KEY'] as string;
const DD_SITE = process.env['NX_DD_SITE'];
// COMMIT_REF environment variable is supplied by netlify on deployment
const version = `${process.env['NX_COMMIT_REF']?.substring(0, 8) || 'local'}`;
const DD_API_KEY = process.env['NX_DD_API_KEY'] as string;
const service = 'web-frontend';
const NX_ENV = process.env['NX_ENV'] as string;
const { disableErrorReporting } = getFromLocalStorage('privacySettings');

datadogRum.init({
  beforeSend: () => {
    if (disableErrorReporting) {
      return false;
    }
  },
  applicationId,
  clientToken,
  site: DD_SITE,
  service,
  env: window.location.hostname,
  version,
  sampleRate: 100,
  trackInteractions: false,
});

export const AppShell = () => {
  const { trackPageview } = Plausible();
  const { themeVariant } = useUserSettingsState();
  const notionalTheme = useNotionalTheme(themeVariant);

  useEffect(() => {
    initPlausible();
    trackPageview();
  }, [trackPageview]);

  return (
    <ThemeProvider theme={notionalTheme}>
      <CssBaseline />
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter5Adapter}>
          <App />
        </QueryParamProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default AppShell;
