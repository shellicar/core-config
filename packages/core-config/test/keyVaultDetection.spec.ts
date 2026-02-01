import { describe, expect, it, vi } from 'vitest';
import { validateKeyVaultReference } from '../src/core/keyVaultDetection';
import { resolveOptions } from '../src/core/resolveOptions';
import { SecureString } from '../src/core/SecureString';
import { KeyVaultReferencePolicy } from '../src/enums';
import { UnresolvedKeyVaultReferenceError } from '../src/errors/UnresolvedKeyVaultReferenceError';
import { expectToThrowErrorWithFields } from './expectToThrowErrorWithFields';

describe('validateKeyVaultReference', () => {
  describe('when policy is Ignore', () => {
    it('does not throw for KeyVault references', () => {
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore });
      const value = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

      const actual = () => validateKeyVaultReference(value, options);

      expect(actual).not.toThrow();
    });

    it('does not warn for KeyVault references', () => {
      const mockLogger = {
        debug: vi.fn(),
        verbose: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      };
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore, logger: mockLogger });
      const value = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

      validateKeyVaultReference(value, options);

      const actual = mockLogger.warn;
      const expectedCalls = 0;
      expect(actual).toHaveBeenCalledTimes(expectedCalls);
    });
  });

  describe('when policy is Warn', () => {
    it('warns for KeyVault references', () => {
      const mockLogger = {
        debug: vi.fn(),
        verbose: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      };
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Warn, logger: mockLogger });
      const value = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

      validateKeyVaultReference(value, options);

      const actual = mockLogger.warn;
      const expectedCalls = 1;
      expect(actual).toHaveBeenCalledTimes(expectedCalls);
    });

    it('does not warn for normal values', () => {
      const mockLogger = {
        debug: vi.fn(),
        verbose: vi.fn(),
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
      };
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Warn, logger: mockLogger });
      const value = 'normalValue';

      validateKeyVaultReference(value, options);

      const actual = mockLogger.warn;
      const expectedCalls = 0;
      expect(actual).toHaveBeenCalledTimes(expectedCalls);
    });
  });

  describe('when policy is Abort', () => {
    it('throws UnresolvedKeyVaultReferenceError for KeyVault references', () => {
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
      const value = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

      const actual = () => validateKeyVaultReference(value, options);

      expect(actual).toThrow(UnresolvedKeyVaultReferenceError);
    });

    it('stores the KeyVault reference in the error', () => {
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
      const expected = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

      expectToThrowErrorWithFields(() => validateKeyVaultReference(expected, options), UnresolvedKeyVaultReferenceError, { keyvaultReference: expected });
    });

    it('does not throw for normal values', () => {
      const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
      const value = 'normalValue';

      const actual = () => validateKeyVaultReference(value, options);

      expect(actual).not.toThrow();
    });
  });
});

describe('SecureString with KeyVault detection', () => {
  it('throws when creating SecureString with unresolved KeyVault reference and policy is Abort', () => {
    const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
    const value = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

    const actual = () => SecureString.from(value, options);

    expect(actual).toThrow(UnresolvedKeyVaultReferenceError);
  });

  it('allows creating SecureString with normal value when policy is Abort', () => {
    const options = resolveOptions({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
    const expected = 'normalSecret';

    const secret = SecureString.from(expected, options);
    const actual = secret.secretValue;

    expect(actual).toBe(expected);
  });
});
