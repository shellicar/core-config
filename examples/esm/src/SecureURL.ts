import { SecureURL } from '@shellicar/core-config';

const url = new URL('https://user:myPassword123@example.com?key=value');
const secureUrl = SecureURL.from(url);

console.log(secureUrl.toString());
// https://user@example.com/?key=value

console.log(secureUrl);
// {
//   href: 'https://user@example.com/',
//   password: 'sha256:71d4ec024886c1c8e4707fb02b46fd568df44e77dd5055cadc3451747f0f2716',
//   searchParams: { key: 'value' }
// }
