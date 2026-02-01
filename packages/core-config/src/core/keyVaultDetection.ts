import { KeyVaultReferencePolicy } from '../enums';
import { UnresolvedKeyVaultReferenceError } from '../errors/UnresolvedKeyVaultReferenceError';
import type { ResolvedOptions } from './types';

const KEYVAULT_REFERENCE_PATTERN = /^@Microsoft\.KeyVault\(.*\)$/;

export const validateKeyVaultReference = (value: string, options: ResolvedOptions): void => {
  if (options.keyVaultReferencePolicy === KeyVaultReferencePolicy.Ignore) {
    return;
  }

  if (!KEYVAULT_REFERENCE_PATTERN.test(value)) {
    return;
  }

  if (options.keyVaultReferencePolicy === KeyVaultReferencePolicy.Abort) {
    throw new UnresolvedKeyVaultReferenceError(value);
  }

  options.logger.warn('Unresolved KeyVault reference detected:', value);
};
