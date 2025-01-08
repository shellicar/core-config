import { equal } from 'node:assert/strict';
import { SecureURL } from '@shellicar/core-config';
import { secretSha, secretString } from './constants';

const url = new URL(`https://:${secretString}@example.uri`);
const s = SecureURL.from(url);
equal(`${s}`, `https://:${encodeURIComponent(secretSha)}@example.uri/`);
