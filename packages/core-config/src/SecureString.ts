import util, { type InspectOptions } from 'node:util';
import { hash } from './hash';
import { BaseObject, type InspectFunction } from './types';

export class SecureString extends BaseObject {
  readonly #value: string;
  readonly #hash: string;

  public get secretValue(): string {
    return this.#value;
  }

  private constructor(value: string, secret?: string) {
    super();
    this.#value = value;
    this.#hash = hash(value, secret);
  }

  static factory(secret: string | undefined): (value: string) => SecureString {
    return (value: string) => SecureString.from(value, secret);
  }

  public static from<T extends string | null | undefined>(value: T, secret?: string): T extends string ? SecureString : T {
    if (value === null) {
      return null as T extends string ? SecureString : T;
    }
    if (value === undefined) {
      return undefined as T extends string ? SecureString : T;
    }
    return new SecureString(value, secret) as T extends string ? SecureString : T;
  }

  public override toString() {
    return this.#hash;
  }
  public override toJSON() {
    return this.toString();
  }
  override [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string {
    if (depth < 0) {
      return '[SecureString]';
    }
    const newOptions = Object.assign({}, options, {
      depth: options.depth == null ? null : options.depth - 1,
    });
    return inspect(this.toJSON(), newOptions);
  }
}
