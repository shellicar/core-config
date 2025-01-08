import util, { type InspectOptions } from 'node:util';
import { SecureString } from './SecureString';
import { BaseObject, type InspectFunction } from './types';

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
    return this.toURL().href;
  }

  toURL(): URL {
    const newUrl = new URL(this.#value.href);
    if (this.#password !== null) {
      newUrl.password = this.#password.toString();
    }
    return newUrl;
  }

  override toJSON(): string {
    return JSON.stringify(this.toURL());
  }

  override [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureURL]';
    }
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1,
    });
    return inspect(this.toURL(), newOptions);
  }
}
