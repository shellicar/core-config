import util, { type InspectOptions } from 'node:util';
import { SecureString } from './SecureString';
import { defaultSecureKeys } from './defaults';
import { BaseObject, type InspectFunction } from './types';

export class SecureConnectionString extends BaseObject {
  readonly #value: string;
  readonly #data: [string, string | SecureString][];

  public get secretValue(): string {
    return this.#value;
  }

  private constructor(value: string, ...secretKeys: string[]) {
    super();
    this.#value = value;
    const keys = secretKeys.length === 0 ? defaultSecureKeys : secretKeys;
    this.#data = this.parseConnectionString(value, ...keys.map((x) => x.toLocaleLowerCase()));
  }

  private parseConnectionString(value: string, ...secretKeys: string[]): [string, string | SecureString][] {
    return value
      .split(';')
      .filter(Boolean)
      .map((pair) => {
        const [key, value] = pair.split('=');
        const v = value ?? '';
        const val = secretKeys.includes(key.toLocaleLowerCase()) ? SecureString.from(v) : v;
        return [key, val];
      });
  }

  public static from(value: null | undefined, ...secretKeys: string[]): null;
  public static from(value: string, ...secretKeys: string[]): SecureConnectionString;
  public static from(value: string | null | undefined, ...secretKeys: string[]) {
    if (value == null) {
      return null;
    }
    return new SecureConnectionString(value, ...secretKeys);
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
