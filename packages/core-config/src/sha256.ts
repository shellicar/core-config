import { type Hash, type Hmac, createHash, createHmac } from 'node:crypto';

const getHash = (secret?: string) => {
  if (secret === undefined) {
    return createHash('sha256');
  }
  return createHmac('sha256', secret);
};

export const sha256 = (input: string, secret?: string) => {
  const hash = getHash(secret);
  const digest = hash.update(input).digest('hex');
  return `sha256:${digest}`;
};
