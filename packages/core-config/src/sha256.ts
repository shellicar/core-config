import { createHash, createHmac } from 'node:crypto';

const getHash = (secret?: string) => {
  if (secret === undefined) {
    return (x: string) => `sha256:${createHash('sha256').update(x).digest('hex')}`;
  }
  return (x: string) => `hs256:${createHmac('sha256', secret).update(x).digest('hex')}`;
};

export const sha256 = (input: string, secret?: string) => {
  const hash = getHash(secret);
  return hash(input);
};
