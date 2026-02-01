import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { resolveOptions } from '../src/core/resolveOptions';
import { SecureConnectionString } from '../src/core/SecureConnectionString';
import { KeyVaultReferencePolicy } from '../src/enums';

describe('SecureConnectionString', () => {
  const defaultOptions = resolveOptions({
    keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore,
  });

  it('toString hashes the secret', () => {
    const connectionString = 'A=B;C=D;SharedAccessKey=F';
    const expected = 'A=B;C=D;SharedAccessKey=sha256:f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9';

    const secureConnectionString = SecureConnectionString.from(connectionString, defaultOptions);

    const actual = secureConnectionString.toString();

    expect(actual).toBe(expected);
  });

  it('toJSON hashes the secret', () => {
    const connectionString = 'A=B;C=D;SharedAccessKey=F';
    const expected = JSON.stringify({
      A: 'B',
      C: 'D',
      SharedAccessKey: 'sha256:f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9',
    });

    const secureConnectionString = SecureConnectionString.from(connectionString, defaultOptions);

    const actual = JSON.stringify(secureConnectionString);

    expect(actual).toBe(expected);
  });

  it('inspect hashes the secret', () => {
    const connectionString = 'A=B;C=D;SharedAccessKey=F';
    const expected = inspect({
      A: 'B',
      C: 'D',
      SharedAccessKey: 'sha256:f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9',
    });

    const secureConnectionString = SecureConnectionString.from(connectionString, defaultOptions);

    const actual = inspect(secureConnectionString);

    expect(actual).toBe(expected);
  });

  it('can get original value', () => {
    const connectionString = 'A=B;C=D;SharedAccessKey=F';
    const expected = 'A=B;C=D;SharedAccessKey=F';

    const secureConnectionString = SecureConnectionString.from(connectionString, defaultOptions);

    const actual = secureConnectionString.secretValue;

    expect(actual).toBe(expected);
  });

  it('can specify secret keys', () => {
    const connectionString = 'A=B;C=D;MySecretKey=F';
    const expected = 'A=B;C=D;MySecretKey=sha256:f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9';

    const options = resolveOptions({
      keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore,
      secretKeys: ['MySecretKey'],
    });
    const secureConnectionString = SecureConnectionString.from(connectionString, options);

    const actual = secureConnectionString.toString();

    expect(actual).toBe(expected);
  });

  it('keys are case insensitive', () => {
    const connectionString = 'A=B;C=D;SHAREDACCESSKEY=F';
    const expected = 'A=B;C=D;SHAREDACCESSKEY=sha256:f67ab10ad4e4c53121b6a5fe4da9c10ddee905b978d3788d2723d7bfacbe28a9';

    const secureConnectionString = SecureConnectionString.from(connectionString, defaultOptions);

    const actual = secureConnectionString.toString();

    expect(actual).toBe(expected);
  });

  it('can use secret key', () => {
    const connectionString = 'A=B;C=D;SharedAccessKey=password';
    const expected = 'A=B;C=D;SharedAccessKey=hs256:7055faebf30a41341bb8d043f6a3a6a18f051f6b30ce6c7b16f7276fe4fdaae7';
    const options = resolveOptions({
      keyVaultReferencePolicy: KeyVaultReferencePolicy.Ignore,
      secret: 'hello',
    });
    const secureConnectionString = SecureConnectionString.from(connectionString, options);

    const actual = secureConnectionString.toString();
    expect(actual).toBe(expected);
  });
});
