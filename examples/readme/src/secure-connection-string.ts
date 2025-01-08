import { equal } from 'node:assert/strict';
import { SecureConnectionString } from '@shellicar/core-config';
import { secretSha, secretString } from './constants';

const s = SecureConnectionString.from(`Host=abc.com;Key=${secretString}`);
equal(`${s}`, `Host=abc.com;Key=${secretSha}`);
