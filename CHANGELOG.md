# Changelog

## [2.0.0] - 2025-08-03

### ⚠️ BREAKING CHANGES

- Exports now use abstract interfaces instead of concrete classes for better type safety
- `SecureString`, `SecureConnectionString`, and `SecureURL` classes are no longer exported - use `createFactory()` instead
- `createFactory()` now takes a configuration object instead of a string parameter

### Security

- Replaced plain text memory storage with AES-256-GCM encryption for all secret values
- Added `EncryptedValue` class for secure in-memory storage with unique per-instance encryption keys
- Added configurable encryption provider to allow custom encryption implementations

### Refactoring

- Extracted proper abstract interfaces for better type safety and extensibility
- Moved type definitions to dedicated interfaces file for better organization

## [1.0.1] - 2025-01-08

## Updated

- Use `hs256` prefix for HMAC-SHA256
- Fix zod example in README

## [1.0.0] - 2025-01-08

## Added

- `secret` parameter to use `HMAC-SHA256`
- `createFactory` method to simplify secret creation

## Updates

- Examples in README

## Structure

- Use `packages` and `examples` monorepo structure

## Packaging

- Use `tsup-node`

## Documentation

- Add `readme` example project

## [0.1.0] - 2025-01-07

Initial release.

[2.0.0]: https://github.com/shellicar/core-config/releases/tag/2.0.0
[1.0.1]: https://github.com/shellicar/core-config/releases/tag/1.0.1
[1.0.0]: https://github.com/shellicar/core-config/releases/tag/1.0.0
[0.1.0]: https://github.com/shellicar/core-config/releases/tag/0.1.0
