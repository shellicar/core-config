import util, { type InspectOptions } from 'node:util';
import { SecureString } from './SecureString';
import { BaseObject, type InspectFunction } from './types';

type UrlObject = {
  href: string;
  password?: string;
  searchParams?: Record<string, string>;
};

/**
 * SecureURL obfuscates the password from the URL.
 */
export class SecureURL extends BaseObject {
  readonly #value: URL;
  readonly #password: SecureString | null;

  public get secretValue(): URL {
    return this.#value;
  }

  private constructor(value: URL, secret: string | undefined) {
    super();
    this.#value = value;
    this.#password = SecureString.from(value.password || null, secret);
  }

  static factory(secret: string | undefined): (value: URL) => SecureURL {
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
    const newUrl = new URL(this.#value.href);
    if (this.#password !== null) {
      newUrl.password = this.#password.toString();
    }
    return newUrl.href;
  }

  override toJSON(): UrlObject {
    const newUrl = new URL(this.#value.href);
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
