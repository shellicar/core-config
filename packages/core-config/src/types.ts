import type util from 'node:util';
import type { KeyVaultReferencePolicy } from './enums';

export type InspectFunction = typeof util.inspect;

export type SecureKeys = readonly string[];

export interface IEncryptedValue {
  getValue(): string;
  toString(): string;
  toJSON(): object;
}

export interface IEncryptionProvider {
  encrypt(value: string): IEncryptedValue;
}

export interface ILogger {
  debug: (message: string, ...args: unknown[]) => void;
  verbose: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}

export interface Options {
  /**
   * Secret key for HMAC hashing. If null, uses simple SHA256.
   */
  secret?: string | null;

  /**
   * Custom encryption provider for encrypting values.
   */
  encryptionProvider?: IEncryptionProvider;

  /**
   * Keys in connection strings that should be treated as secrets.
   */
  secretKeys?: SecureKeys;

  /**
   * Policy for handling unresolved KeyVault references.
   * @default KeyVaultReferencePolicy.Warn
   */
  keyVaultReferencePolicy?: KeyVaultReferencePolicy;

  /**
   * Enable debug logging.
   * @default false
   */
  debug?: boolean;

  /**
   * Enable verbose logging.
   * @default false
   */
  verbose?: boolean;

  /**
   * Custom logger instance. If provided, debug/verbose options are ignored.
   */
  logger?: ILogger;
}
