import { useState, useEffect } from 'react';
import { encryptString, decryptString } from './cryptoUtils';

export interface PNPKIConfig {
  enabled: boolean;
  p12Base64: string;       // base64-encoded .p12 bytes
  fileName: string;        // original file name (display only)
  password: string;        // P12 passphrase
  signerName: string;
  signerPosition: string;    // shown below signer name (previously 'signNote')
  page: number;            // 1-based page index
  signAllPages: boolean;
  xRatio: number;          // 0-1 relative to page width
  yRatio: number;          // 0-1 relative to page height (from top)
  wRatio: number;
  hRatio: number;
  serverUrl: string;
  signImageBase64?: string;
  signImageFileName?: string;
  signTextScale?: number;      // font scale multiplier within sig box (default 1)
  signTextOffsetX?: number;    // text x-offset as fraction within box (default 0)
  signTextOffsetY?: number;    // text y-offset as fraction within box (default 0)
  signImageScale?: number;     // image scale within sig box (default 1)
  signImageOffsetX?: number;   // image x-offset as fraction within box (default 0)
  signImageOffsetY?: number;   // image y-offset as fraction within box (default 0)
  sigFontSize?: number;        // font size in px at 190px editor reference height (default 24)
  sigFontFamily?: string;      // CSS font-family (default 'Arial, sans-serif')
  sigTextColor?: string;       // CSS color string (default '#1e3a5f')
  showSignedBy: boolean;       // Prepend 'Digitally Signed by:' label
}

export const DEFAULT_PNPKI_CONFIG: PNPKIConfig = {
  enabled: false,
  p12Base64: '',
  fileName: '',
  password: '',
  signerName: '',
  signerPosition: '',
  page: 1,
  signAllPages: false,
  xRatio: 0.363,
  yRatio: 0.765,
  wRatio: 0.262,
  hRatio: 0.087,
  serverUrl: import.meta.env.VITE_PNPKI_SERVER,
  signTextScale: 1,
  signTextOffsetX: 0,
  signTextOffsetY: 0,
  signImageScale: 1,
  signImageOffsetX: 0,
  signImageOffsetY: 0,
  sigFontSize: 10,      // % of sig-box height (1-30)
  sigFontFamily: 'Arial, sans-serif',
  sigTextColor: '#1e3a5f',
  showSignedBy: false,
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
          // Backwards-compat: migrate old 'signNote' key to 'signerPosition'
          if (parsed.signNote !== undefined && parsed.signerPosition === undefined) {
            parsed.signerPosition = parsed.signNote;
            delete parsed.signNote;
          }
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
  form.append('sign_note', cfg.signerPosition);
  form.append('page', String(cfg.page));
  form.append('sign_all_pages', cfg.signAllPages ? 'true' : 'false');
  form.append('x_ratio', String(cfg.xRatio));
  form.append('y_ratio', String(cfg.yRatio));
  form.append('w_ratio', String(cfg.wRatio));
  form.append('h_ratio', String(cfg.hRatio));

  // Build composite design canvas (image + styled text) and send as sign_design.
  // The Flask server uses this as the stamp background — gives full appearance control.
  const designBlob = await buildSignDesignBlob(cfg);
  if (designBlob) {
    form.append('sign_design', new File([designBlob], 'sign-design.png', { type: 'image/png' }));
  }

  // Keep sign_image as fallback for older servers that don't support sign_design
  if (cfg.signImageBase64 && !designBlob) {
    const imgBytes = Uint8Array.from(atob(cfg.signImageBase64), (c) => c.charCodeAt(0));
    form.append('sign_image', new File([imgBytes], cfg.signImageFileName || 'sig.png', { type: 'image/png' }));
  }

  // Pin to the env-configured server — never use the mutable cfg.serverUrl from storage
  const pinnedServer = (import.meta.env.VITE_PNPKI_SERVER as string).replace(/\/$/, '');
  const res = await fetch(`${pinnedServer}/sign-pdf`, { method: 'POST', body: form });

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`PNPKI signing failed (${res.status}): ${msg}`);
  }

  return res.blob();
}

/**
 * Render the signature appearance (image + styled text) to an offscreen canvas
 * and return it as a PNG Blob.  The Flask server accepts this as `sign_design`
 * and uses it directly as the stamp background.
 */
export async function buildSignDesignBlob(cfg: PNPKIConfig): Promise<Blob | null> {
  // Canvas dimensions based on sig box aspect ratio
  const W = 1000;
  const H = Math.max(160, Math.round(W * (cfg.hRatio / cfg.wRatio)));

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Draw image layer — mirrors CSS objectFit:contain inside a (scale*W) × (scale*H) box
  if (cfg.signImageBase64) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const scale      = cfg.signImageScale ?? 1;
        const contW      = scale * W;                          // container width
        const contH      = scale * H;                          // container height
        const imgAspect  = img.naturalWidth / Math.max(1, img.naturalHeight);
        const contAspect = contW / contH;                      // = W/H (scale cancels)

        // objectFit: contain — fit inside container preserving aspect ratio
        let drawW: number, drawH: number;
        if (imgAspect >= contAspect) {
          drawW = contW;
          drawH = contW / imgAspect;
        } else {
          drawH = contH;
          drawW = contH * imgAspect;
        }

        // Center within container (same centering CSS objectFit: contain applies)
        const contX = (cfg.signImageOffsetX ?? 0) * W;
        const contY = (cfg.signImageOffsetY ?? 0) * H;
        const drawX = contX + (contW - drawW) / 2;
        const drawY = contY + (contH - drawH) / 2;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = `data:image/png;base64,${cfg.signImageBase64}`;
    });
  }

  // Draw text layer
  // sigFontSize is stored as % of box height (1-30), so both preview and canvas
  // compute the same proportion → WYSIWYG match.
  const fontSize    = (cfg.sigFontSize ?? 10) / 100 * H * (cfg.signTextScale ?? 1);
  const fontFamily  = cfg.sigFontFamily ?? 'Arial, sans-serif';
  const color       = cfg.sigTextColor  ?? '#1e3a5f';
  const lines: string[] = [];
  if (cfg.showSignedBy) {
    lines.push('Digitally Signed by:');
  }
  lines.push(cfg.signerName || 'Signer');
  if (cfg.signerPosition) {
    lines.push(cfg.signerPosition);
  }

  ctx.fillStyle    = color;
  ctx.textBaseline = 'top';

  const textX = (cfg.signTextOffsetX ?? 0) * W;
  const textY = (cfg.signTextOffsetY ?? 0) * H;
  const lineH = fontSize * 1.35;

  lines.forEach((line, i) => {
    let currentFontSize = fontSize;
    let currentFontWeight = 'normal';

    if (cfg.showSignedBy && i === 0) {
      // "Digitally Signed by:" label
      currentFontSize = fontSize * 0.8;
      ctx.fillStyle = '#64748b'; // Slate-500
    } else if ((cfg.showSignedBy && i === 1) || (!cfg.showSignedBy && i === 0)) {
      // Signer Name
      currentFontWeight = 'bold';
      ctx.fillStyle = color;
    } else {
      // Signer Position
      ctx.fillStyle = color;
    }

    ctx.font = `${currentFontWeight} ${currentFontSize}px ${fontFamily}`;
    ctx.fillText(line, textX, textY + (cfg.showSignedBy && i > 0 ? (i - 1) * lineH + (fontSize * 0.8 * 1.35) : i * lineH));
  });

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
}
