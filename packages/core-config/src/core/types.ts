import type { ILogger, Options } from '../types';

type RequiredOptions = 'secret' | 'encryptionProvider' | 'secretKeys' | 'keyVaultReferencePolicy' | 'debug' | 'verbose' | 'logger';

type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type ResolvedOptions = MakeRequired<Options, RequiredOptions> & {
  logger: ILogger;
};
