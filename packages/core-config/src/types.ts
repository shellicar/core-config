import util, { type InspectOptions } from 'node:util';

export type InspectFunction = typeof util.inspect;

export abstract class BaseObject {
  public abstract toString(): string;
  public abstract toJSON(): string | object;
  public abstract [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string;
}

export type SecureKeys = readonly string[];
