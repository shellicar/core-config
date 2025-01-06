import util, { type InspectOptions } from 'node:util';
import { sha256 } from './sha256';
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

  public get secretValue(): URL {
    return this.#value;
  }

  private constructor(value: URL) {
    super();
    this.#value = value;
  }

  public static from(value: undefined | null): null;
  public static from(value: URL): SecureURL;
  public static from(value: URL | null | undefined): SecureURL | null {
    if (value == null) {
      return null;
    }
    return new SecureURL(value);
  }

  override toString(): string {
    const newUrl = new URL(this.#value.href);
    if (newUrl.password) {
      newUrl.password = sha256(newUrl.password);
    }
    return newUrl.href;
  }

  override toJSON(): object {
    const newUrl = new URL(this.#value.href);

    const searchParams = new URLSearchParams(newUrl.searchParams);
    newUrl.search = '';

    let password: string | undefined;
    if (newUrl.password) {
      password = sha256(newUrl.password);
      newUrl.password = '';
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
