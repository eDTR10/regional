import { useState, useEffect } from 'react';
import { encryptString, decryptString } from './cryptoUtils';

export interface PNPKIConfig {
  enabled: boolean;
  p12Base64: string;       // base64-encoded .p12 bytes
  fileName: string;        // original file name (display only)
  password: string;        // P12 passphrase
  signerName: string;
  signNote: string;
  page: number;            // 1-based page index
  signAllPages: boolean;
  xRatio: number;          // 0-1 relative to page width
  yRatio: number;          // 0-1 relative to page height (from top)
  wRatio: number;
  hRatio: number;
  serverUrl: string;
  signImageBase64?: string;
  signImageFileName?: string;
}

export const DEFAULT_PNPKI_CONFIG: PNPKIConfig = {
  enabled: false,
  p12Base64: '',
  fileName: '',
  password: '',
  signerName: '',
  signNote: '',
  page: 1,
  signAllPages: false,
  xRatio: 0.363,
  yRatio: 0.765,
  wRatio: 0.262,
  hRatio: 0.087,
  serverUrl: import.meta.env.VITE_PNPKI_SERVER,
};

const STORAGE_KEY = 'pnpki_config';

export function usePNPKI(storageKey: string = STORAGE_KEY, defaultOverrides: Partial<PNPKIConfig> = {}) {
  const defaults: PNPKIConfig = { ...DEFAULT_PNPKI_CONFIG, ...defaultOverrides };

  const [config, setConfig] = useState<PNPKIConfig>(defaults);

  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.p12Base64) parsed.p12Base64 = await decryptString(parsed.p12Base64);
          if (parsed.password)  parsed.password  = await decryptString(parsed.password);
          setConfig({ ...defaults, ...parsed });
        }
      } catch {
        // ignore
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const saveConfig = async (next: PNPKIConfig): Promise<void> => {
    setConfig(next);
    try {
      const toStore = { ...next };
      if (toStore.p12Base64) toStore.p12Base64 = await encryptString(toStore.p12Base64);
      if (toStore.password)  toStore.password  = await encryptString(toStore.password);
      localStorage.setItem(storageKey, JSON.stringify(toStore));
    } catch {
      // storage quota exceeded — silently ignore
    }
  };

  const clearConfig = () => {
    setConfig(defaults);
    localStorage.removeItem(storageKey);
  };

  return { config, saveConfig, clearConfig };
}

/** Convert a PDF blob + PNPKI config into a signed PDF blob via the Flask backend. */
export async function signPdfWithPNPKI(
  pdfBlob: Blob,
  cfg: PNPKIConfig,
  fileName: string
): Promise<Blob> {
  const form = new FormData();

  // PDF file
  form.append('pdf_file', new File([pdfBlob], fileName, { type: 'application/pdf' }));

  // P12 — decode base64 back to binary
  const p12Bytes = Uint8Array.from(atob(cfg.p12Base64), (c) => c.charCodeAt(0));
  form.append('p12_file', new File([p12Bytes], cfg.fileName, { type: 'application/x-pkcs12' }));

  form.append('password', cfg.password);
  form.append('signer_name', cfg.signerName);
  form.append('sign_note', cfg.signNote);
  form.append('page', String(cfg.page));
  form.append('sign_all_pages', cfg.signAllPages ? 'true' : 'false');
  form.append('x_ratio', String(cfg.xRatio));
  form.append('y_ratio', String(cfg.yRatio));
  form.append('w_ratio', String(cfg.wRatio));
  form.append('h_ratio', String(cfg.hRatio));

  if (cfg.signImageBase64) {
    const imgBytes = Uint8Array.from(atob(cfg.signImageBase64), (c) => c.charCodeAt(0));
    form.append(
      'sign_image',
      new File([imgBytes], cfg.signImageFileName || 'sig.png', { type: 'image/png' })
    );
  }

  const res = await fetch(`${cfg.serverUrl}/sign-pdf`, { method: 'POST', body: form });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`PNPKI signing failed (${res.status}): ${msg}`);
  }

  return res.blob();
}
