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
  
  // Designer Fields
  imgWidthPct?: number;       // % of stamp width
  textSizePct?: number;       // % of stamp height
  imgTop?: number;            // % from top (center)
  imgLeft?: number;           // % from left (center)
  txtTop?: number;            // % from top (top-left for text block)
  txtLeft?: number;           // % from left (top-left for text block)
  
  sigFontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  nameColor?: string;
  positionColor?: string;
  signedByColor?: string;
  
  showSignedBy: boolean;
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
  imgWidthPct: 35,
  textSizePct: 18,
  imgTop: 5,
  imgLeft: 50,
  txtTop: 55,
  txtLeft: 50,
  sigFontFamily: 'Inter, sans-serif',
  isBold: true,
  isItalic: false,
  nameColor: '#1e3a5f',
  positionColor: '#2563eb',
  signedByColor: '#64748b',
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
  // Send a space to bypass backend text rendering so it only uses our generated image
  form.append('signer_name', ' ');
  form.append('sign_note', ' ');
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
 *
 * IMPORTANT: The drawing logic here MUST exactly match the StampPreview canvas
 * component in PNPKISetup.tsx so preview == output (true WYSIWYG).
 */
export async function buildSignDesignBlob(cfg: PNPKIConfig): Promise<Blob | null> {
  // A4 page dimensions in points — wRatio/hRatio are relative to the page,
  // so the actual stamp aspect ratio must factor in the page dimensions.
  const PDF_W = 595, PDF_H = 842;
  const W = 1000;
  const H = Math.max(160, Math.round(W * (cfg.hRatio * PDF_H) / (cfg.wRatio * PDF_W)));

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ── Font sizes ────────────────────────────────────────────────────────────
  const tsp          = (cfg.textSizePct ?? 18) / 100;
  const nameFs       = Math.max(0.01, tsp         * H);
  const posFs        = Math.max(0.01, tsp * 0.833 * H);
  const signedByFs   = Math.max(0.01, tsp * 0.667 * H);
  const isItalic     = cfg.isItalic ? 'italic ' : '';
  const isBold       = cfg.isBold !== false ? 'bold ' : '';
  const fontFamily   = cfg.sigFontFamily ?? 'Inter, sans-serif';

  // ── Parse name lines ──────────────────────────────────────────────────────
  const nameLines = cfg.signerName
    ? cfg.signerName
        .replace(/<br\s*\/?>/gi, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
    : [];

  // ── Draw text function (called after image so text is on top) ─────────────
  const drawText = () => {
    const tx = ((cfg.txtLeft ?? 50) / 100) * W;
    const ty = ((cfg.txtTop  ?? 55) / 100) * H;
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';

    let nameY = ty;

    // "Digitally Signed by:" label
    if (cfg.showSignedBy) {
      ctx.font      = `${isItalic}${signedByFs}px ${fontFamily}`;
      ctx.fillStyle = cfg.signedByColor ?? '#64748b';
      ctx.fillText('Digitally Signed by:', tx, ty);
      nameY = ty + signedByFs * 1.4;
    }

    // Signer name
    if (nameLines.length) {
      ctx.font      = `${isItalic}${isBold}${nameFs}px ${fontFamily}`;
      ctx.fillStyle = cfg.nameColor ?? '#1e3a5f';
      nameLines.forEach((line, i) => {
        ctx.fillText(line, tx, nameY + i * nameFs * 1.3);
      });
    }

    // Position / title
    if (cfg.signerPosition) {
      ctx.font      = `${isItalic}${posFs}px ${fontFamily}`;
      ctx.fillStyle = cfg.positionColor ?? '#2563eb';
      ctx.fillText(cfg.signerPosition, tx, nameY + nameLines.length * nameFs * 1.3);
    }
  };

  // ── Draw image layer, then text ───────────────────────────────────────────
  if (cfg.signImageBase64) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const iw = ((cfg.imgWidthPct ?? 35) / 100) * W;
        const ih = img.naturalHeight * (iw / Math.max(1, img.naturalWidth));
        const ix = ((cfg.imgLeft ?? 50) / 100) * W - iw / 2;
        const iy = ((cfg.imgTop  ?? 5)  / 100) * H;
        ctx.drawImage(img, ix, iy, iw, ih);
        drawText();
        resolve();
      };
      img.onerror = () => { drawText(); resolve(); };
      img.src = `data:image/png;base64,${cfg.signImageBase64}`;
    });
  } else {
    drawText();
  }

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
}
