import { SecureConnectionString, SecureString, SecureURL } from '@shellicar/core-config';

console.log(SecureString.from('myPassword123'));
console.log(SecureConnectionString.from('Server=myserver.uri;Password=myPassword123'));
console.log(SecureURL.from(new URL('http://myuser:myPassword123@myserver.uri')));
