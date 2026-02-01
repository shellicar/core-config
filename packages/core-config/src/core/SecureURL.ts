import util, { type InspectOptions } from 'node:util';
import { ISecureURL } from '../interfaces';
import type { IEncryptedValue, InspectFunction } from '../types';
import { validateKeyVaultReference } from './keyVaultDetection';
import { SecureString } from './SecureString';
import type { ResolvedOptions } from './types';

type UrlObject = {
  href: string;
  password?: string;
  searchParams?: Record<string, string>;
};

export class SecureURL extends ISecureURL {
  readonly #encryptedValue: IEncryptedValue;
  readonly #password: SecureString | null;

  public get secretValue(): URL {
    return new URL(this.#encryptedValue.getValue());
  }

  private constructor(value: URL, options: ResolvedOptions) {
    super();
    validateKeyVaultReference(value.href, options);
    this.#encryptedValue = options.encryptionProvider.encrypt(value.href);
    const decodedPassword = value.password ? decodeURIComponent(value.password) : null;
    this.#password = SecureString.from(decodedPassword, options);
  }

  static factory(options: ResolvedOptions): (value: URL) => ISecureURL {
    return (value: URL) => SecureURL.from(value, options);
  }

  public static from<T extends URL | null | undefined>(value: T, options: ResolvedOptions): T extends URL ? SecureURL : T {
    if (value === null) {
      return null as T extends URL ? SecureURL : T;
    }
    if (value === undefined) {
      return undefined as T extends URL ? SecureURL : T;
    }
    return new SecureURL(value, options) as T extends URL ? SecureURL : T;
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
  override [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureURL]';
    }
    const newOptions = Object.assign({}, inspectOptions, {
      depth: inspectOptions.depth == null ? null : inspectOptions.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
