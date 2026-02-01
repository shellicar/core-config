import { defaultSecureKeys } from '../defaults';
import { KeyVaultReferencePolicy } from '../enums';
import type { Options } from '../types';

export const defaultOptions = {
  secret: null,
  secretKeys: defaultSecureKeys,
  keyVaultReferencePolicy: KeyVaultReferencePolicy.Warn,
  debug: false,
  verbose: false,
} as const satisfies Options;
