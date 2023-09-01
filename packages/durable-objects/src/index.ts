import { DurableObjectNamespace } from '@cloudflare/workers-types';
import { RegistryDOEnv } from './registries';

export { Logger } from './logger';
export * from './abstract';
export * from './registries';
export * from './views-do';

export interface APIEnv extends RegistryDOEnv {
  GHOST_ADMIN_KEY: string;
  NX_DD_API_KEY: string;
  NX_DATA_URL: string;
  DATA_SERVICE_URL: string;
  DATA_SERVICE_AUTH_TOKEN: string;
  ACCOUNTS_REGISTRY_DO: DurableObjectNamespace;
  VIEWS_DO: DurableObjectNamespace;
  VIEWS_NAME: string;
}
