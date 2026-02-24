/**
 * AES-256-GCM encryption helpers for PNPKI sensitive fields.
 * Key is derived from VITE_PNPKI_ENCRYPT_KEY via PBKDF2 so raw env string
 * is never used directly as a crypto key.
 */

const RAW_KEY = import.meta.env.VITE_PNPKI_ENCRYPT_KEY ?? 'fallback-key';
const SALT    = new TextEncoder().encode('pnpki-v1-salt');

async function deriveKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(RAW_KEY),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: SALT, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/** Returns a base64 string containing IV + ciphertext */
export async function encryptString(plain: string): Promise<string> {
  const key = await deriveKey();
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const ct  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain));
  const out = new Uint8Array(12 + ct.byteLength);
  out.set(iv, 0);
  out.set(new Uint8Array(ct), 12);
  return btoa(String.fromCharCode(...out));
}

/** Decrypts a value produced by encryptString; returns original plain text */
export async function decryptString(encrypted: string): Promise<string> {
  const key  = await deriveKey();
  const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv   = data.slice(0, 12);
  const ct   = data.slice(12);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return new TextDecoder().decode(plain);
}
