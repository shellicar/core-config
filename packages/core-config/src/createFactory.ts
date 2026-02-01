import { resolveOptions } from './core/resolveOptions';
import { SecureConnectionString } from './core/SecureConnectionString';
import { SecureString } from './core/SecureString';
import { SecureURL } from './core/SecureURL';
import type { ISecureFactory } from './interfaces';
import type { Options } from './types';

export const createFactory = (options?: Options): ISecureFactory => {
  const resolved = resolveOptions(options ?? {});

  return {
    string: SecureString.factory(resolved),
    connectionString: SecureConnectionString.factory(resolved),
    url: SecureURL.factory(resolved),
  };
};
