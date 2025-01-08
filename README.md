# @shellicar/core-config

> A library for securely handling sensitive configuration values like connection strings, URLs, and secrets.

[![npm package](https://img.shields.io/npm/v/@shellicar/core-config.svg)](https://npmjs.com/package/@shellicar/core-config)
[![build status](https://github.com/shellicar/core-config/actions/workflows/node.js.yml/badge.svg)](https://github.com/shellicar/core-config/actions/workflows/node.js.yml)

## Features

- 🔐 **SecureString** - Safely handle sensitive string values with automatic hashing for logs and serialization
- 🔗 **SecureConnectionString** - Parse and protect connection strings with configurable secret key detection
- 🌐 **SecureURL** - Handle URLs while protecting sensitive components like passwords

## Installation & Quick Start

```sh
npm i --save @shellicar/core-config
```

```sh
pnpm add @shellicar/core-config
```

```ts
import { SecureString, SecureConnectionString, SecureURL } from '@shellicar/core-config';

console.log(SecureString.from('myPassword123'));
console.log(SecureConnectionString.from('Server=myserver.uri;Password=myPassword123'));
console.log(SecureURL.from(new URL('http://myuser:myPassword123@myserver.uri')));
```

<!-- BEGIN_ECOSYSTEM -->

## @shellicar TypeScript Ecosystem

### Core Libraries

- [`@shellicar/core-config`](https://github.com/shellicar/core-config) - A library for securely handling sensitive configuration values like connection strings, URLs, and secrets.
- [`@shellicar/core-di`](https://github.com/shellicar/core-di) - A basic dependency injection library.
- [`@shellicar/core-foundation`](https://github.com/shellicar/core-foundation) - A comprehensive starter repository.

### Build Tools

- [`@shellicar/build-version`](https://github.com/shellicar/build-version) - Build plugin that calculates and exposes version information through a virtual module import.
- [`@shellicar/build-graphql`](https://github.com/shellicar/build-graphql) - Build plugin that loads GraphQL files and makes them available through a virtual module import.

### Framework Adapters

- [`@shellicar/svelte-adapter-azure-functions`](https://github.com/shellicar/svelte-adapter-azure-functions) - A [SvelteKit adapter](https://kit.svelte.dev/docs/adapters) that builds your app into an Azure Function.

### Logging & Monitoring

- [`@shellicar/winston-azure-application-insights`](https://github.com/shellicar/winston-azure-application-insights) - An [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights/) transport for [Winston](https://github.com/winstonjs/winston) logging library.
- [`@shellicar/pino-applicationinsights-transport`](https://github.com/shellicar/pino-applicationinsights-transport) - [Azure Application Insights](https://azure.microsoft.com/en-us/services/application-insights) transport for [pino](https://github.com/pinojs/pino)

<!-- END_ECOSYSTEM -->

## Motivation

To make storing and comparing configuration including secrets easy and simple.

You can easily output or display your configuration, even secret/secure values, without having to manually hash them or extract them.

## Feature Examples

Three main classes, `SecureString`, `SecureConnectionString`, and `SecureURL`.

See [readme examples](./examples/readme/src) for example source code.

- Handle strings.

```typescript
import { SecureString } from '@shellicar/core-config';

const secret = SecureString.from('myPassword123');

console.log(secret.toString()); 
// sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716

console.log(JSON.stringify({ secret }));
// {"secret":"sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716"}
```

- Handle connection strings (`Key=Value[;Key=Value...]`).

```typescript
import { SecureConnectionString } from '@shellicar/core-config';

const conn = SecureConnectionString.from('Server=myserver;Password=myPassword123');
console.log(conn.toString());
// Server=myserver;Password=sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716

// Custom secret keys
console.log(SecureConnectionString.from('Server=myserver;SuperSecretKey=myPassword123', 'SuperSecretKey'));
// {
//   Server: 'myserver',
//   SuperSecretKey: 'sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716'
// }
```

- Handle URLs with passwords.information:

```typescript
import { SecureURL } from '@shellicar/core-config';

const url = new URL('https://user:myPassword123@example.com?key=value');
const secureUrl = SecureURL.from(url);

console.log(secureUrl.toString());
// https://user:sha256%3A71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716@example.com/?key=value

console.log(secureUrl);
// {
//   href: 'https://user@example.com/',
//   password: 'sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716',
//   searchParams: { key: 'value' }
// }
```

- Use HMAC.

```ts
import { SecureString } from '@shellicar/core-config';

const secret = SecureString.from('myPassword123', 'mySecret');

console.log(secret.toString()); 
// sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716

console.log(JSON.stringify({ secret }));
// {"secret":"sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716"}
```

### Default Secure Keys

For a list of default secure keys for connection strings, see [defaults.ts](./packages/core-config/src/defaults.ts).

### Secure Output

All secure types implement proper toString(), toJSON(), and inspect() methods to ensure sensitive data is never accidentally exposed through logs or serialization.

### Real World Example

Using with Zod for environment variable validation:

```typescript
import { z } from 'zod';
import { SecureString, SecureURL, SecureConnectionString } from '@shellicar/core-config';

const envSchema = z.object({
  // MongoDB connection string with username/password
  MONGODB_URL: z.string().url().transform(url => SecureURL.from(new URL(url))),
  
  // API key for external service
  API_KEY: z.string().min(1).transform(SecureString.from),
  
  // SQL Server connection string
  SQL_CONNECTION: z.string().transform(SecureConnectionString.from),
});

// Parse environment variables
const config = envSchema.parse(process.env);

// Values are now strongly typed and secured
console.log(config.MONGODB_URL.toString());
// https://myuser@mongodb.example.com/

console.log(config.API_KEY.toString());
// sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716

console.log(config.SQL_CONNECTION.toString());
// Server=myserver;Database=mydb;User Id=admin;Password=sha256:71d4ec...
```

All sensitive values are automatically hashed in logs and serialization, while still being accessible via the `secretValue` property when needed.
