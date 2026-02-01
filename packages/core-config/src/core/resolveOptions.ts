import type { Options } from '../types';
import { createLogger } from './createLogger';
import { defaultOptions } from './defaultOptions';
import { EncryptedValue } from './EncryptedValue';
import type { ResolvedOptions } from './types';

const defaultEncryptionProvider = {
  encrypt: (value: string) => EncryptedValue.from(value),
};

export const resolveOptions = (inputOptions: Options): ResolvedOptions => {
  const base = {
    ...defaultOptions,
    ...inputOptions,
    encryptionProvider: inputOptions.encryptionProvider ?? defaultEncryptionProvider,
  };

  const options = {
    ...base,
    logger: inputOptions.logger ?? createLogger({ prefix: 'core-config', debug: base.debug, verbose: base.verbose }),
  } satisfies ResolvedOptions;

  return options;
};
