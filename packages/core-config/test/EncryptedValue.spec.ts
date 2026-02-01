import { describe, expect, it } from 'vitest';
import { EncryptedValue } from '../src/core/EncryptedValue';

describe('EncryptedValue', () => {
  it('encrypts and decrypts values correctly', () => {
    const expected = 'my-secret-password';

    const encrypted = EncryptedValue.from(expected);
    const actual = encrypted.getValue();

    expect(actual).toBe(expected);
  });

  it('returns expected toString', () => {
    const secret = 'super-secret-password';
    const expected = '[EncryptedValue]';

    const encrypted = EncryptedValue.from(secret);
    const actual = encrypted.toString();

    expect(actual).toBe(expected);
  });

  it('returns expected JSON object', () => {
    const secret = 'another-secret';
    const expected = { type: 'EncryptedValue', encrypted: true };

    const encrypted = EncryptedValue.from(secret);
    const actual = encrypted.toJSON();

    expect(actual).toEqual(expected);
  });

  it('works with empty strings', () => {
    const expected = '';

    const encrypted = EncryptedValue.from(expected);
    const actual = encrypted.getValue();

    expect(actual).toBe(expected);
  });

  it('works with unicode characters', () => {
    const expected = '🔒 Secret with émojis and ñ characters 中文';

    const encrypted = EncryptedValue.from(expected);
    const actual = encrypted.getValue();

    expect(actual).toBe(expected);
  });
});
