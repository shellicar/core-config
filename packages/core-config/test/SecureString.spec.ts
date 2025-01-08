import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { SecureString } from '../src/SecureString';

describe('SecureString', () => {
  it('toString hashes the secret', () => {
    const secret = 'hello';
    const expected = 'sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

    const secureString = SecureString.from(secret);
    const actual = secureString.toString();

    expect(actual).toBe(expected);
  });

  it('toJSON hashes the secret', () => {
    const secret = 'hello';
    const expected = '"sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"';

    const secureString = SecureString.from(secret);
    const actual = JSON.stringify(secureString);

    expect(actual).toBe(expected);
  });

  it('inspect hashes the secret', () => {
    const secret = 'hello';
    const expected = "'sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824'";

    const secureString = SecureString.from(secret);
    const actual = inspect(secureString);

    expect(actual).toBe(expected);
  });

  it('can get original value', () => {
    const secret = 'hello';
    const expected = 'hello';

    const secureString = SecureString.from(secret);
    const actual = secureString.secretValue;

    expect(actual).toBe(expected);
  });

  it('can use secret key', () => {
    const secret = 'hello';
    const expected = 'sha256:2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824';

    const secureString = SecureString.from(secret, 'hello');
    const actual = secureString.toString();

    expect(actual).not.toBe(expected);
  });
});
