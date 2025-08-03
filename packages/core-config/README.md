# @shellicar/core-config

> A library for securely handling sensitive configuration values like connection strings, URLs, and secrets.

[![npm package](https://img.shields.io/npm/v/@shellicar/core-config.svg)](https://npmjs.com/package/@shellicar/core-config)
[![build status](https://github.com/shellicar/core-config/actions/workflows/node.js.yml/badge.svg)](https://github.com/shellicar/core-config/actions/workflows/node.js.yml)

## Installation & Quick Start

```sh
npm i --save @shellicar/core-config
```

```sh
pnpm add @shellicar/core-config
```

```ts
import { createFactory } from '@shellicar/core-config';

const factory = createFactory();

console.log(factory.string('myPassword123'));
console.log(factory.connectionString('Server=myserver.uri;Password=myPassword123'));
console.log(factory.url(new URL('http://myuser:myPassword123@myserver.uri')));
```

## Documentation

For full documentation, visit [here](https://github.com/shellicar/core-config).
