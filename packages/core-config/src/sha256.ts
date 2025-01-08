import { createHash, createHmac } from 'node:crypto';

export const hashSha256 = (input: string) => {
  return createHash('sha256').update(input).digest('hex');
};

export const sha256 = (input: string, secret?: string) => {
  const algorithm = secret === undefined ? createHash('sha256') : createHmac('sha256', secret);
  const hash = algorithm.update(input).digest('hex');
  return `sha256:${hash}`;
};
