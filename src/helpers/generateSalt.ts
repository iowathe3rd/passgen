import { Crypto } from '@peculiar/webcrypto';

export async function generateSalt(input: string): Promise<string> {
  const crypto = new Crypto();
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  });
}
