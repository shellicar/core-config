import util, { type InspectOptions } from 'node:util';
import { EncryptedValue } from './EncryptedValue';
import { SecureString } from './SecureString';
import { ISecureURL } from './interfaces';
import type { InspectFunction } from './types';

type UrlObject = {
  href: string;
  password?: string;
  searchParams?: Record<string, string>;
};

export class SecureURL extends ISecureURL {
  readonly #encryptedValue: EncryptedValue;
  readonly #password: SecureString | null;

  public get secretValue(): URL {
    return new URL(this.#encryptedValue.getValue());
  }

  private constructor(value: URL, secret: string | undefined) {
    super();
    this.#encryptedValue = new EncryptedValue(value.href);
    this.#password = SecureString.from(value.password || null, secret);
  }

  static factory(secret: string | undefined): (value: URL) => ISecureURL {
    return (value: URL) => SecureURL.from(value, secret);
  }

  public static from<T extends URL | null | undefined>(value: T, secret?: string): T extends URL ? SecureURL : T {
    if (value === null) {
      return null as T extends URL ? SecureURL : T;
    }
    if (value === undefined) {
      return undefined as T extends URL ? SecureURL : T;
    }
    return new SecureURL(value, secret) as T extends URL ? SecureURL : T;
  }

  override toString(): string {
    const originalUrl = this.secretValue;
    const newUrl = new URL(originalUrl.href);
    if (this.#password !== null) {
      newUrl.password = this.#password.toString();
    }
    return newUrl.href;
  }

  override toJSON(): UrlObject {
    const originalUrl = this.secretValue;
    const newUrl = new URL(originalUrl.href);
    newUrl.password = '';

    const searchParams = new URLSearchParams(newUrl.searchParams);
    newUrl.search = '';

    let password: string | undefined;
    if (this.#password !== null) {
      password = this.#password.toString();
    }

    const result: UrlObject = {
      href: newUrl.href,
    };
    if (password !== undefined) {
      result.password = password;
    }
    if (searchParams.size > 0) {
      result.searchParams = Object.fromEntries(searchParams);
    }
    return result;
  }
  override [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureURL]';
    }
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
