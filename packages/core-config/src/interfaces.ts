import util, { type InspectOptions } from 'node:util';
import type { InspectFunction } from './types';

export abstract class ISecureString {
  public abstract toString(): string;
  public abstract toJSON(): string | object;
  public abstract [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string;
  public abstract get secretValue(): string;
}

export abstract class ISecureConnectionString {
  public abstract toString(): string;
  public abstract toJSON(): string | object;
  public abstract [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string;
  public abstract get secretValue(): string;
}

export abstract class ISecureURL {
  public abstract toString(): string;
  public abstract toJSON(): object;
  public abstract [util.inspect.custom](depth: number, options: InspectOptions, inspect: InspectFunction): string;
  public abstract get secretValue(): URL;
}

export interface ISecureFactory {
  string(value: string): ISecureString;
  connectionString(value: string): ISecureConnectionString;
  url(value: URL): ISecureURL;
}
