import { equal } from 'node:assert/strict';
import { SecureString } from '@shellicar/core-config';
import { secretSha, secretString } from './constants';

const s = SecureString.from(secretString);
equal(`${s}`, secretSha);
