import { equal } from 'node:assert/strict';
import { SecureConnectionString, SecureString, SecureURL } from '@shellicar/core-config';
import { secretHmac, secretKey, secretString } from './constants';

const secureString = SecureString.from(secretString, secretKey);
const secureConnectionString = SecureConnectionString.from(`Host=abc.com;Key=${secretString}`, undefined, secretKey);
const secureURL = SecureURL.from(new URL(`http://:${secretString}@example.uri/`), secretKey);

equal(`${secureString}`, secretHmac);
equal(`${secureConnectionString}`, `Host=abc.com;Key=${secretHmac}`);
equal(`${secureURL}`, `http://:${encodeURIComponent(secretHmac)}@example.uri/`);
