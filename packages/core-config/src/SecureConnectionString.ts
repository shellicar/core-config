import util, { type InspectOptions } from 'node:util';
import { SecureString } from './SecureString';
import { defaultSecureKeys } from './defaults';
import { BaseObject, type InspectFunction, type SecureKeys } from './types';

export class SecureConnectionString extends BaseObject {
  readonly #value: string;
  readonly #data: [string, string | SecureString][];

  public get secretValue(): string {
    return this.#value;
  }

  private constructor(value: string, secretKeys: SecureKeys, secret: string | undefined) {
    super();
    this.#value = value;
    this.#data = this.parseConnectionString(
      value,
      secretKeys.map((x) => x.toLocaleLowerCase()),
      secret,
    );
  }

  private parseConnectionString(value: string, secretKeys: SecureKeys, secret: string | undefined): [string, string | SecureString][] {
    return value
      .split(';')
      .filter(Boolean)
      .map((pair) => {
        const [key, value] = pair.split('=');
        const v = value ?? '';
        const val = secretKeys.includes(key.toLocaleLowerCase()) ? SecureString.from(v, secret) : v;
        return [key, val];
      });
  }

  static factory(secret: string | undefined, secretKeys?: SecureKeys): (value: string) => SecureConnectionString {
    return (value: string) => SecureConnectionString.from(value, secretKeys, secret);
  }

  public static from<T extends string | null | undefined>(value: T, secretKeys?: SecureKeys, secret?: string): T extends string ? SecureConnectionString : T {
    if (value === null) {
      return null as T extends string ? SecureConnectionString : T;
    }
    if (value === undefined) {
      return undefined as T extends string ? SecureConnectionString : T;
    }
    return new SecureConnectionString(value, secretKeys ?? defaultSecureKeys, secret) as T extends string ? SecureConnectionString : T;
  }

  public override toString(): string {
    return this.#data.map(([key, value]) => `${key}=${value}`).join(';');
  }

  public override toJSON(): object {
    return Object.fromEntries(this.#data);
  }

  public override [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureConnectionString]';
    }
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
