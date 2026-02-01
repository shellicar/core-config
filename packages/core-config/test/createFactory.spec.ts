import { describe, expect, it, vi } from 'vitest';
import { createFactory } from '../src/createFactory';
import { KeyVaultReferencePolicy } from '../src/enums';
import { UnresolvedKeyVaultReferenceError } from '../src/errors/UnresolvedKeyVaultReferenceError';

describe('createFactory with KeyVault policy', () => {
  const keyVaultReference = '@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/mysecret)';

  describe('string factory', () => {
    describe('when policy is Ignore', () => {
      it('creates SecureString without throwing', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore });
        const expected = keyVaultReference;

        const secret = factory.string(keyVaultReference);
        const actual = secret.secretValue;

        expect(actual).toBe(expected);
      });
    });

    describe('when policy is Warn', () => {
      it('creates SecureString with correct value', () => {
        const mockLogger = {
          debug: vi.fn(),
          verbose: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
        };
        const factory = createFactory({
          keyVaultReferencePolicy: KeyVaultReferencePolicy.Warn,
          logger: mockLogger,
        });
        const expected = keyVaultReference;

        const secret = factory.string(keyVaultReference);
        const actual = secret.secretValue;

        expect(actual).toBe(expected);
      });

      it('logs warning for KeyVault reference', () => {
        const mockLogger = {
          debug: vi.fn(),
          verbose: vi.fn(),
          info: vi.fn(),
          warn: vi.fn(),
          error: vi.fn(),
        };
        const factory = createFactory({
          keyVaultReferencePolicy: KeyVaultReferencePolicy.Warn,
          logger: mockLogger,
        });

        factory.string(keyVaultReference);

        const actual = mockLogger.warn;
        const expectedCalls = 1;
        expect(actual).toHaveBeenCalledTimes(expectedCalls);
      });
    });

    describe('when policy is Abort', () => {
      it('throws UnresolvedKeyVaultReferenceError', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });

        const actual = () => factory.string(keyVaultReference);

        expect(actual).toThrow(UnresolvedKeyVaultReferenceError);
      });

      it('allows normal values', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
        const expected = 'normalSecret';

        const secret = factory.string(expected);
        const actual = secret.secretValue;

        expect(actual).toBe(expected);
      });
    });
  });

  describe('connectionString factory', () => {
    describe('when policy is Abort', () => {
      it('throws for KeyVault reference in connection string', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });

        const actual = () => factory.connectionString(keyVaultReference);

        expect(actual).toThrow(UnresolvedKeyVaultReferenceError);
      });

      it('allows normal connection strings', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
        const expected = 'Server=localhost;Database=test';

        const connectionString = factory.connectionString(expected);
        const actual = connectionString.secretValue;

        expect(actual).toBe(expected);
      });
    });
  });

  describe('url factory', () => {
    describe('when policy is Abort', () => {
      it('throws for KeyVault reference in URL password', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
        const url = new URL('https://user:password@localhost:8080/');
        url.password = keyVaultReference;

        const actual = () => factory.url(url);

        expect(actual).toThrow(UnresolvedKeyVaultReferenceError);
      });

      it('allows normal URLs', () => {
        const factory = createFactory({ keyVaultReferencePolicy: KeyVaultReferencePolicy.Abort });
        const expected = 'https://user:password@localhost:8080/';

        const secureUrl = factory.url(new URL(expected));
        const actual = secureUrl.secretValue.href;

        expect(actual).toBe(expected);
      });
    });
  });
});
