import util, { type InspectOptions } from 'node:util';
import { ISecureConnectionString } from '../interfaces';
import type { IEncryptedValue, InspectFunction, SecureKeys } from '../types';
import { validateKeyVaultReference } from './keyVaultDetection';
import { SecureString } from './SecureString';
import type { ResolvedOptions } from './types';

export class SecureConnectionString extends ISecureConnectionString {
  readonly #encryptedValue: IEncryptedValue;
  readonly #data: [string, string | SecureString][];

  public get secretValue(): string {
    return this.#encryptedValue.getValue();
  }

  private constructor(value: string, options: ResolvedOptions) {
    super();
    validateKeyVaultReference(value, options);
    this.#encryptedValue = options.encryptionProvider.encrypt(value);
    this.#data = this.parseConnectionString(
      value,
      options.secretKeys.map((x) => x.toLocaleLowerCase()),
      options,
    );
  }

  private parseConnectionString(value: string, secretKeys: SecureKeys, options: ResolvedOptions): [string, string | SecureString][] {
    return value
      .split(';')
      .filter(Boolean)
      .map((pair) => {
        const [key, value] = pair.split('=');
        const v = value ?? '';
        const val = secretKeys.includes(key.toLocaleLowerCase()) ? SecureString.from(v, options) : v;
        return [key, val];
      });
  }

  static factory(options: ResolvedOptions): (value: string) => SecureConnectionString {
    return (value: string) => SecureConnectionString.from(value, options);
  }

  public static from<T extends string | null | undefined>(value: T, options: ResolvedOptions): T extends string ? SecureConnectionString : T {
    if (value === null) {
      return null as T extends string ? SecureConnectionString : T;
    }
    if (value === undefined) {
      return undefined as T extends string ? SecureConnectionString : T;
    }
    return new SecureConnectionString(value, options) as T extends string ? SecureConnectionString : T;
  }

  public override toString(): string {
    return this.#data.map(([key, value]) => `${key}=${value}`).join(';');
  }

  public override toJSON(): object {
    return Object.fromEntries(this.#data);
  }

  public override [util.inspect.custom](depth: number, inspectOptions: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureConnectionString]';
    }
    const newOptions = Object.assign({}, inspectOptions, {
      depth: inspectOptions.depth == null ? null : inspectOptions.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
