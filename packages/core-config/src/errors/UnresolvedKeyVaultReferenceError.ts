export class UnresolvedKeyVaultReferenceError extends Error {
  public readonly keyvaultReference: string;

  constructor(keyvaultReference: string) {
    super('Unresolved KeyVault reference detected');
    this.keyvaultReference = keyvaultReference;
    this.name = 'UnresolvedKeyVaultReferenceError';
  }
}
