import util, { type InspectOptions } from 'node:util';
import { ISecureString } from '../interfaces';
import type { IEncryptedValue, InspectFunction } from '../types';
import { hash } from './hash';
import { validateKeyVaultReference } from './keyVaultDetection';
import type { ResolvedOptions } from './types';

export class SecureString extends ISecureString {
  readonly #encryptedValue: IEncryptedValue;
  readonly #hash: string;

  public get secretValue(): string {
    return this.#encryptedValue.getValue();
  }

  private constructor(value: string, options: ResolvedOptions) {
    super();
    validateKeyVaultReference(value, options);
    this.#encryptedValue = options.encryptionProvider.encrypt(value);
    this.#hash = hash(value, options.secret);
  }

  static factory(options: ResolvedOptions): (value: string) => SecureString {
    return (value: string) => SecureString.from(value, options);
  }

  public static from<T extends string | null | undefined>(value: T, options: ResolvedOptions): T extends string ? SecureString : T {
    if (value === null) {
      return null as T extends string ? SecureString : T;
    }
    if (value === undefined) {
      return undefined as T extends string ? SecureString : T;
    }
    return new SecureString(value, options) as T extends string ? SecureString : T;
  }

  public override toString() {
    return this.#hash;
  }
  public override toJSON() {
    return this.toString();
  }
  override [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureString]';
    }
    const newOptions = Object.assign({}, inspectOptions, {
      depth: inspectOptions.depth == null ? null : inspectOptions.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
