import { inspect } from 'node:util';
import { describe, expect, it } from 'vitest';
import { SecureURL } from '../src/SecureURL';

describe('SecureURL', () => {
  it('toString hides the secret', () => {
    const url = new URL('https://user:password@localhost:8080/');
    const expected = 'https://user:sha256%3A5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8@localhost:8080/';

    const secureUrl = SecureURL.from(url);

    const actual = secureUrl.toString();

    expect(actual).toBe(expected);
  });

  it('toJSON hashes the secret', () => {
    const url = new URL('https://user:password@localhost:8080/');
    const expected = JSON.stringify({
      href: 'https://user@localhost:8080/',
      password: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    });

    const secureUrl = SecureURL.from(url);

    const actual = JSON.stringify(secureUrl);

    expect(actual).toBe(expected);
  });

  it('toString without password', () => {
    const url = new URL('https://localhost:8080/');
    const expected = 'https://localhost:8080/';

    const secureUrl = SecureURL.from(url);

    const actual = secureUrl.toString();
    expect(actual).toBe(expected);
  });

  it('toJson works without password', () => {
    const url = new URL('https://localhost:8080/');
    const expected = JSON.stringify({
      href: 'https://localhost:8080/',
    });

    const secureUrl = SecureURL.from(url);

    const actual = JSON.stringify(secureUrl);
    expect(actual).toBe(expected);
  });

  it('toJSON splits the options', () => {
    const url = new URL('https://user:password@localhost:8080?a=b&c=d');
    const expected = JSON.stringify({
      href: 'https://user@localhost:8080/',
      password: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      searchParams: {
        a: 'b',
        c: 'd',
      },
    });

    const secureUrl = SecureURL.from(url);
    const actual = JSON.stringify(secureUrl);

    expect(actual).toBe(expected);
  });

  it('inspect hashes the secret', () => {
    const url = new URL('https://user:password@localhost:8080/');
    const expected = inspect({
      href: 'https://user@localhost:8080/',
      password: 'sha256:5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    });

    const secureUrl = SecureURL.from(url);

    const actual = inspect(secureUrl);

    expect(actual).toEqual(expected);
  });

  it('can get original value', () => {
    const url = new URL('https://user:password@localhost:8080/');
    const expected = new URL('https://user:password@localhost:8080/');

    const secureUrl = SecureURL.from(url);

    const actual = secureUrl.secretValue;

    expect(actual.href).toBe(expected.href);
  });
});
