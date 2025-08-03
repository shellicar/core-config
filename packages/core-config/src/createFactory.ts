import { SecureConnectionString } from './SecureConnectionString';
import { SecureString } from './SecureString';
import { SecureURL } from './SecureURL';
import type { ISecureFactory } from './interfaces';

export const createFactory = (secret?: string): ISecureFactory => {
  return {
    string: SecureString.factory(secret),
    connectionString: SecureConnectionString.factory(secret),
    url: SecureURL.factory(secret),
  };
};
