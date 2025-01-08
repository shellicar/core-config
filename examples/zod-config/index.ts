import { SecureConnectionString, SecureString, SecureURL } from '@shellicar/core-config';
import { z } from 'zod';

const env = {
  MONGODB_URL: 'mongodb://user:password@localhost:27017/?authSource=admin',
  API_KEY: 'abcd123',
  SQL_CONNECTION: 'Server=myserver;Database=mydb;User Id=admin;Password=myPassword123',
};

const envSchema = z.object({
  // MongoDB connection string with username/password
  MONGODB_URL: z
    .string()
    .url()
    .transform((url) => SecureURL.from(new URL(url))),

  // API key for external service
  API_KEY: z
    .string()
    .min(1)
    .transform((x) => SecureString.from(x)),

  // SQL Server connection string
  SQL_CONNECTION: z.string().transform((x) => SecureConnectionString.from(x)),
});

// Parse environment variables
const config = envSchema.parse(env);

// Values are now strongly typed and secured
console.log(config.MONGODB_URL.toString());
// https://myuser@mongodb.example.com/

console.log(config.API_KEY.toString());
// sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716

console.log(config.SQL_CONNECTION.toString());
// Server=myserver;Database=mydb;User Id=admin;Password=sha256:71d4ec...
