import util, { type InspectOptions } from 'node:util';
import type { SecureConnectionString } from './SecureConnectionString';
import type { SecureString } from './SecureString';
import type { SecureURL } from './SecureURL';

export type InspectFunction = typeof util.inspect;

export abstract class BaseObject {
  public abstract toString(): string;
  public abstract toJSON(): string | object;
  public abstract [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string;
}

export type SecureFactory = {
  string: (value: string) => SecureString;
  connectionString: (value: string, secretKeys?: readonly string[]) => SecureConnectionString;
  url: (value: URL) => SecureURL;
};
