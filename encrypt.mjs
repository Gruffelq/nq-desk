// Encrypts a plaintext briefing for NQ Desk with the public key in keys.json.
// Usage: node encrypt.mjs path/to/data.json > data.enc.json
// Only the owner's password can decrypt the result (see setup.html). Never commit data.json itself.
import { readFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const [, , input = 'data.json'] = process.argv;
const keys = JSON.parse(readFileSync(new URL('./keys.json', import.meta.url), 'utf8'));
const plain = readFileSync(input, 'utf8');
JSON.parse(plain); // refuse to encrypt invalid JSON

const b64 = (buf) => Buffer.from(buf).toString('base64');
const te = new TextEncoder();

const pub = await crypto.subtle.importKey('jwk', keys.pub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
const eph = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
const bits = await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, eph.privateKey, 256);
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const hk = await crypto.subtle.importKey('raw', bits, 'HKDF', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'HKDF', hash: 'SHA-256', salt, info: te.encode('nq-desk-v1') },
  hk, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, te.encode(plain));
const epk = await crypto.subtle.exportKey('jwk', eph.publicKey);

process.stdout.write(JSON.stringify({ v: 1, epk, salt: b64(salt), iv: b64(iv), ct: b64(ct) }));
