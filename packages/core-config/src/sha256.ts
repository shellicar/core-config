import { createHash } from 'node:crypto';

export const sha256 = (input: string) => {
  const hash = createHash('sha256').update(input).digest('hex');
  return `sha256:${hash}`;
};
