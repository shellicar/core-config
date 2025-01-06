import { inspect } from 'node:util';
import { sha256 } from './sha256';
import { BaseObject } from './types';

export class SecureString extends BaseObject {
  readonly #value: string;

  public get secretValue(): string {
    return this.#value;
  }

  private constructor(value: string) {
    super();
    this.#value = value;
  }
  public override toString() {
    return sha256(this.#value);
  }
  public override toJSON() {
    return this.toString();
  }
  public override [inspect.custom]() {
    return inspect(this.toString());
  }

  public static from(value: string): SecureString;
  public static from(value: null | undefined): null;
  public static from(value: string | null | undefined): SecureString | null {
    if (value == null) {
      return null;
    }
    return new SecureString(value);
  }
}
