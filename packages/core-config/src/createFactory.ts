import { SecureConnectionString } from './SecureConnectionString';
import { SecureString } from './SecureString';
import { SecureURL } from './SecureURL';
import type { SecureFactory } from './types';

export const createFactory = (secret?: string): SecureFactory => {
  return {
    string: SecureString.factory(secret),
    connectionString: SecureConnectionString.factory(secret),
    url: SecureURL.factory(secret),
  };
};
