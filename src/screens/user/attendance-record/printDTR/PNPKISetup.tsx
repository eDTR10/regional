import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DEFAULT_PNPKI_CONFIG, PNPKIConfig } from './usePNPKI';
import {
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  GripVertical,
  KeyRoundIcon,
  LoaderIcon,
  Trash2Icon,
  UploadIcon,
  MousePointer2,
  ChevronDown
} from 'lucide-react';

const FONT_OPTIONS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "'Trebuchet MS', sans-serif", label: "Trebuchet MS" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "'Brush Script MT', cursive", label: "Brush Script MT" },
  { value: "'Segoe Script', cursive", label: "Segoe Script" },
  { value: "'Segoe Script Bold', cursive", label: "Segoe Script Bold" },
  { value: "'Comic Sans MS', cursive", label: "Comic Sans MS" },
];

// ─────────────────────────────────────────────────────────────────────────────
//  STAMP PREVIEW (canvas-based)
//  Uses the EXACT SAME drawing logic as buildSignDesignBlob in usePNPKI.ts
//  so preview == output (true WYSIWYG).
// ─────────────────────────────────────────────────────────────────────────────
interface StampPreviewProps {
  cssW: number;
  cssH: number;
  signImageBase64?: string;
  signerName?: string;
  signerPosition?: string;
  showSignedBy?: boolean;
  imgTop?: number;
  imgLeft?: number;
  imgWidthPct?: number;
  txtTop?: number;
  txtLeft?: number;
  textSizePct?: number;
  sigFontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  nameColor?: string;
  positionColor?: string;
  signedByColor?: string;
}

function StampPreview({
  cssW, cssH,
  signImageBase64,
  signerName, signerPosition,
  showSignedBy = false,
  imgTop = 5, imgLeft = 50, imgWidthPct = 35,
  txtTop = 55, txtLeft = 50, textSizePct = 18,
  sigFontFamily = 'Inter, sans-serif',
  isBold = true, isItalic = false,
  nameColor = '#1e3a5f', positionColor = '#2563eb', signedByColor = '#64748b',
}: StampPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = Math.max(1, Math.round(cssW));
    const H = Math.max(1, Math.round(cssH));
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    // Mirror buildSignDesignBlob exactly so preview == output
    const tsp = textSizePct / 100;
    const nameFs = Math.max(0.01, tsp * H);
    const posFs = Math.max(0.01, tsp * 0.833 * H);
    const signedByFs = Math.max(0.01, tsp * 0.667 * H);

    const nameLines = signerName
      ? signerName
        .replace(/<br\s*\/?>/gi, '\n')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
      : [];

    const drawText = () => {
      const tx = (txtLeft / 100) * W;
      const ty = (txtTop / 100) * H;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      let nameY = ty;
      if (showSignedBy) {
        ctx.font = `${isItalic ? 'italic ' : ''}${signedByFs}px ${sigFontFamily}`;
        ctx.fillStyle = signedByColor;
        ctx.fillText('Digitally Signed by:', tx, ty);
        nameY = ty + signedByFs * 1.4;
      }

      if (nameLines.length) {
        ctx.font = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${nameFs}px ${sigFontFamily}`;
        ctx.fillStyle = nameColor;
        nameLines.forEach((line, i) => {
          ctx.fillText(line, tx, nameY + i * nameFs * 1.3);
        });
      }

      if (signerPosition) {
        ctx.font = `${isItalic ? 'italic ' : ''}${posFs}px ${sigFontFamily}`;
        ctx.fillStyle = positionColor;
        ctx.fillText(signerPosition, tx, nameY + nameLines.length * nameFs * 1.3);
      }
    };

    if (signImageBase64) {
      const img = new Image();
      img.onload = () => {
        const iw = (imgWidthPct / 100) * W;
        const ih = img.naturalHeight * (iw / Math.max(1, img.naturalWidth));
        const ix = (imgLeft / 100) * W - iw / 2;
        const iy = (imgTop / 100) * H;
        ctx.drawImage(img, ix, iy, iw, ih);
        drawText();
      };
      img.onerror = () => drawText();
      img.src = `data:image/png;base64,${signImageBase64}`;
    } else {
      drawText();
    }
  }, [cssW, cssH, signImageBase64, signerName, signerPosition, showSignedBy,
    imgTop, imgLeft, imgWidthPct, txtTop, txtLeft, textSizePct,
    sigFontFamily, isItalic, isBold, nameColor, positionColor, signedByColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  config: PNPKIConfig;
  onSave: (cfg: PNPKIConfig) => Promise<void>;
  onClear: () => void;
  /** Live DTR PDF blob to preview — generated by PrintDTR when the dialog opens */
  pdfBlob?: Blob | null;
  /** Total pages in the PDF — enables the Page to Sign selector */
  totalPages?: number;
}

// ── pdfjs CDN loader (no npm package needed) ──────────────────────────────────
let _pdfjs: any = null;
function loadPdfJs(): Promise<any> {
  if (_pdfjs) return Promise.resolve(_pdfjs);
  if ((window as any).pdfjsLib) {
    _pdfjs = (window as any).pdfjsLib;
    return Promise.resolve(_pdfjs);
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      _pdfjs = lib;
      resolve(lib);
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ── helpers ───────────────────────────────────────────────────────────────────
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── Signature placement canvas with live PDF preview ─────────────────────────
interface CanvasProps {
  xRatio: number;
  yRatio: number;
  wRatio: number;
  hRatio: number;
  onChange: (x: number, y: number, w: number, h: number) => void;
  /** Rendered page number (1-based) */
  pageNum?: number;
  /** PDF blob to preview in the background */
  pdfBlob?: Blob | null;
  /** Signature appearance fields */
  signerName?: string;
  signerPosition?: string;
  signImageBase64?: string;
  /** Content position & scale within the sig box */
  imgWidthPct?: number;
  textSizePct?: number;
  imgTop?: number;
  imgLeft?: number;
  txtTop?: number;
  txtLeft?: number;
  onContentChange?: (offsetX: number, offsetY: number, scale: number, type: 'text' | 'image') => void;
  /** Text appearance */
  sigFontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  nameColor?: string;
  positionColor?: string;
  signedByColor?: string;
  showSignedBy?: boolean;
}

function SigCanvas({
  xRatio, yRatio, wRatio, hRatio, onChange,
  pageNum = 1, pdfBlob, signerName, signerPosition, signImageBase64,
  imgWidthPct = 35, textSizePct = 18, imgTop = 5, imgLeft = 50, txtTop = 55, txtLeft = 50,
  onContentChange,
  sigFontFamily = 'Inter, sans-serif', isBold = true, isItalic = false,
  nameColor = '#1e3a5f', positionColor = '#2563eb', signedByColor = '#64748b',
  showSignedBy = false,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Keep stage size in sync with responsive layout so preview math always matches output.
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dragging = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizing = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null);
  const contentDragging = useRef<{ startX: number; startY: number; origOX: number; origOY: number; type: 'text' | 'image' } | null>(null);

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // ── render PDF page onto background canvas ────────────────────────────────
  useEffect(() => {
    if (!pdfBlob) { setPdfReady(false); return; }
    if (!stageSize.width) return;
    let cancelled = false;
    setPdfLoading(true);
    setPdfReady(false);

    (async () => {
      try {
        const pdfjs = await loadPdfJs();
        if (cancelled) return;

        const ab = await pdfBlob.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: ab }).promise;
        const pg = await doc.getPage(Math.min(pageNum, doc.numPages));
        if (cancelled) return;

        const canvas = bgCanvasRef.current;
        if (!canvas) return;

        const containerW = stageSize.width || stageRef.current?.clientWidth || 420;
        const raw = pg.getViewport({ scale: 1 });
        const scale = containerW / raw.width;
        const vp = pg.getViewport({ scale });

        canvas.width = vp.width;
        canvas.height = vp.height;

        const ctx = canvas.getContext('2d')!;
        await pg.render({ canvasContext: ctx, viewport: vp }).promise;

        if (!cancelled) { setPdfReady(true); setPdfLoading(false); }
      } catch (err) {
        console.warn('PDF preview failed:', err);
        if (!cancelled) setPdfLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pdfBlob, pageNum, stageSize.width]);

  // ── drag / resize ─────────────────────────────────────────────────────────
  const onMouseDownBox = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      dragging.current = { startX: e.clientX, startY: e.clientY, origX: xRatio, origY: yRatio };
    },
    [xRatio, yRatio]
  );

  const onMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); e.stopPropagation();
      resizing.current = { startX: e.clientX, startY: e.clientY, origW: wRatio, origH: hRatio };
    },
    [wRatio, hRatio]
  );



  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const stageEl = stageRef.current;
      if (!stageEl) return;
      const rect = stageEl.getBoundingClientRect();
      const stageW = stageEl.clientWidth || rect.width;
      const stageH = stageEl.clientHeight || rect.height;
      if (!stageW || !stageH) return;

      if (dragging.current) {
        const dx = (e.clientX - dragging.current.startX) / stageW;
        const dy = (e.clientY - dragging.current.startY) / stageH;
        onChange(
          clamp(dragging.current.origX + dx, 0, 1 - wRatio),
          clamp(dragging.current.origY + dy, 0, 1 - hRatio),
          wRatio, hRatio
        );
      }
      if (resizing.current) {
        const dw = (e.clientX - resizing.current.startX) / stageW;
        const dh = (e.clientY - resizing.current.startY) / stageH;
        onChange(xRatio, yRatio,
          clamp(resizing.current.origW + dw, 0.05, 1 - xRatio),
          clamp(resizing.current.origH + dh, 0.02, 1 - yRatio)
        );
      }
      if (contentDragging.current && onContentChange) {
        const boxW = stageW * wRatio;
        const boxH = stageH * hRatio;
        if (!boxW || !boxH) return;
        // Calculate dragging in percentages (0-100)
        const dxPct = ((e.clientX - contentDragging.current.startX) / boxW) * 100;
        const dyPct = ((e.clientY - contentDragging.current.startY) / boxH) * 100;
        const { type } = contentDragging.current;
        const scale = type === 'image' ? imgWidthPct : textSizePct; // we pass the size as the 'scale' parameter to keep the signature
        const boundsX = { min: 0, max: 100 };
        const boundsY = { min: 0, max: 100 };
        onContentChange(
          clamp(contentDragging.current.origOX + dxPct, boundsX.min, boundsX.max),
          clamp(contentDragging.current.origOY + dyPct, boundsY.min, boundsY.max),
          scale,
          type
        );
      }
    };
    const onUp = () => { dragging.current = null; resizing.current = null; contentDragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [xRatio, yRatio, wRatio, hRatio, onChange, onContentChange, imgWidthPct, textSizePct]);

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  const interactionsLocked = !!pdfBlob && !pdfReady;

  return (
    <div className="flex flex-col gap-1 flex-1 min-h-0">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-muted-foreground select-none">
          Drag the top grip to move · <span className="font-bold">⌟</span> grip to resize · drag <span className="font-bold">image</span> to move
        </p>
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded px-1">
          <button type="button" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="w-6 h-6 hover:bg-white dark:hover:bg-slate-700 rounded text-muted-foreground hover:text-foreground font-bold shadow-sm transition-all">-</button>
          <span className="w-10 text-center text-xs font-medium text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom(z => Math.min(3, z + 0.25))} className="w-6 h-6 hover:bg-white dark:hover:bg-slate-700 rounded text-muted-foreground hover:text-foreground font-bold shadow-sm transition-all">+</button>
        </div>
      </div>

      {/* ── Canvas container ── */}
      <div
        ref={containerRef}
        className="relative w-full border border-gray-300 dark:border-slate-700 shadow-inner select-none overflow-auto bg-white"
        style={{ maxHeight: '65vh' }}
      >
        <div
          ref={stageRef}
          className="relative origin-top-left"
          style={{ width: `${zoom * 100}%`, ...(pdfReady ? {} : { aspectRatio: '1 / 1.414' }) }}
        >
          {/* PDF background */}
          <canvas
            ref={bgCanvasRef}
            className="block w-full h-auto"
            style={{ display: pdfReady ? 'block' : 'none' }}
          />

          {/* Fallback blank page (shown before PDF loads) */}
          {!pdfReady && (
            <div className="absolute inset-0 bg-white">
              {[0.25, 0.5, 0.75].map((v) => (
                <div key={`h${v}`} className="absolute w-full border-t border-dashed border-gray-100"
                  style={{ top: pct(v) }} />
              ))}
              {[0.25, 0.5, 0.75].map((v) => (
                <div key={`v${v}`} className="absolute h-full border-l border-dashed border-gray-100"
                  style={{ left: pct(v) }} />
              ))}
            </div>
          )}

          {/* Loading spinner */}
          {pdfLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <LoaderIcon className="w-5 h-5 animate-spin text-blue-500" />
              <span className="ml-2 text-xs text-muted-foreground">Loading PDF…</span>
            </div>
          )}

          {/* ── Overlay: signature box ── */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute border-2 border-blue-400 border-dashed rounded"
              style={{
                left: pct(xRatio), top: pct(yRatio),
                width: pct(wRatio), height: pct(hRatio),
                pointerEvents: interactionsLocked ? 'none' : 'all',
                background: 'rgba(255,255,255,0.5)',
              }}
            >
              {/* Floating drag grip kept outside the content so text/image never gets covered */}
              <div
                onMouseDown={onMouseDownBox}
                className="absolute left-1/2 -translate-x-1/2 -top-5 h-4 px-2 rounded-full flex items-center justify-center z-30 border border-white/80 shadow-sm"
                style={{
                  background: 'rgba(37,99,235,0.92)',
                  cursor: interactionsLocked ? 'not-allowed' : 'move',
                  pointerEvents: 'all',
                }}
                title="Drag stamp"
              >
                <GripVertical className="rotate-90" style={{ width: 12, height: 12, color: 'white', opacity: 0.9 }} />
              </div>

              {/* ── Signature appearance preview (canvas-based WYSIWYG) ── */}
              <div className="w-full h-full relative overflow-hidden rounded-[2px]">
                <StampPreview
                  cssW={(stageSize.width || 400) * wRatio}
                  cssH={(stageSize.height || 200) * hRatio}
                  signImageBase64={signImageBase64}
                  signerName={signerName}
                  signerPosition={signerPosition}
                  showSignedBy={showSignedBy}
                  imgTop={imgTop}
                  imgLeft={imgLeft}
                  imgWidthPct={imgWidthPct}
                  txtTop={txtTop}
                  txtLeft={txtLeft}
                  textSizePct={textSizePct}
                  sigFontFamily={sigFontFamily}
                  isBold={isBold}
                  isItalic={isItalic}
                  nameColor={nameColor}
                  positionColor={positionColor}
                  signedByColor={signedByColor}
                />
              </div>

              {/* Floating resize grip kept outside content area */}
              <div
                onMouseDown={onMouseDownResize}
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 cursor-se-resize rounded-full z-30 border border-white shadow-sm"
                style={{ lineHeight: '14px', textAlign: 'center', fontSize: 9, color: 'white', pointerEvents: 'all' }}
                title="Resize stamp"
              >
                ⌟
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Numeric readout */}
      <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground text-center">
        {[['X', xRatio], ['Y', yRatio], ['W', wRatio], ['H', hRatio]].map(([label, value]) => (
          <div key={label as string} className="bg-muted rounded px-1 py-0.5">
            <span className="font-mono">{label}: {Number(value).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main dialog ──────────────────────────────────────────────────────────────
export default function PNPKISetup({ open, onClose, config, onSave, onClear, pdfBlob, totalPages = 1 }: Props) {
  const [draft, setDraft] = useState<PNPKIConfig>(config);
  const [showPass, setShowPass] = useState(false);
  const [p12Error, setP12Error] = useState('');
  const [sigImgPreview, setSigImgPreview] = useState<string | null>(null);

  // Sync when parent config changes (e.g. clear)
  useEffect(() => setDraft(config), [config]);

  // Rebuild preview when config arrives with a saved image
  useEffect(() => {
    if (config.signImageBase64) {
      setSigImgPreview(`data:image/png;base64,${config.signImageBase64}`);
    }
  }, [config.signImageBase64]);

  const stampDesRef = useRef<HTMLDivElement>(null);
  const [designerDragging, setDesignerDragging] = useState<null | 'img' | 'txt'>(null);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const [designerWidth, setDesignerWidth] = useState(300);

  // Track the designer container width for accurate canvas rendering
  useEffect(() => {
    const el = stampDesRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDesignerWidth(entry.contentRect.width || 300);
      }
    });
    ro.observe(el);
    setDesignerWidth(el.clientWidth || 300);
    return () => ro.disconnect();
  }, [open]); // re-run when dialog opens

  // designer mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!designerDragging || !stampDesRef.current) return;
      const rect = stampDesRef.current.getBoundingClientRect();
      const pctX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const pctY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setDraft((d) => {
        if (designerDragging === 'img') {
          return { ...d, imgLeft: pctX, imgTop: pctY };
        } else {
          return { ...d, txtLeft: pctX, txtTop: pctY };
        }
      });
    };
    const onUp = () => setDesignerDragging(null);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); };
  }, [designerDragging]);

  const set = <K extends keyof PNPKIConfig>(key: K, value: PNPKIConfig[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const updateStampSize = (nextW: number, nextH: number) => {
    setDraft((d) => {
      const wRatio = clamp(nextW, 0.05, 0.95);
      const hRatio = clamp(nextH, 0.02, 0.4);
      return {
        ...d,
        wRatio,
        hRatio,
        xRatio: clamp(d.xRatio, 0, 1 - wRatio),
        yRatio: clamp(d.yRatio, 0, 1 - hRatio),
      };
    });
  };

  // ── P12 file ──
  const handleP12 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(p12|pfx)$/i)) {
      setP12Error('Please select a .p12 or .pfx file.');
      return;
    }
    setP12Error('');
    const b64 = await fileToBase64(file);
    setDraft((d) => ({ ...d, p12Base64: b64, fileName: file.name, enabled: true }));
  };

  // ── Sig image ──
  const handleSigImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setSigImgPreview(`data:image/png;base64,${b64}`);
    setDraft((d) => ({ ...d, signImageBase64: b64, signImageFileName: file.name }));
  };

  const clearSigImage = () => {
    setSigImgPreview(null);
    setDraft((d) => ({ ...d, signImageBase64: undefined, signImageFileName: undefined }));
  };

  const handleCanvasChange = useCallback(
    (x: number, y: number, w: number, h: number) =>
      setDraft((d) => ({ ...d, xRatio: x, yRatio: y, wRatio: w, hRatio: h })),
    []
  );

  const handleContentChange = useCallback(
    (offsetX: number, offsetY: number, scale: number, type: 'text' | 'image') =>
      setDraft((d) =>
        type === 'image'
          ? { ...d, imgLeft: offsetX, imgTop: offsetY, imgWidthPct: scale }
          : { ...d, txtLeft: offsetX, txtTop: offsetY, textSizePct: scale }
      ),
    []
  );

  const handleSave = async () => {
    if (!draft.p12Base64) {
      setP12Error('Please upload a P12/PFX certificate first.');
      return;
    }
    await onSave({ ...draft, enabled: true });
    onClose();
  };

  const handleClear = () => {
    setSigImgPreview(null);
    setDraft(DEFAULT_PNPKI_CONFIG);
    setP12Error('');
    onClear();
    onClose();
  };

  const isConfigured = !!config.p12Base64 && config.enabled;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRoundIcon className="w-5 h-5 text-blue-500" />
            PNPKI Digital Signature Setup
            {isConfigured && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-normal text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <CheckCircle2Icon className="w-3 h-3" /> Configured
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* ─ Two-column layout ─ */}
        <div className="flex flex-row lg:flex-col gap-4 overflow-y-auto flex-1 min-h-0 pr-1">

          {/* ── LEFT: placement canvas ─────── */}
          <div className="flex flex-1 flex-col gap-2 min-h-0 min-w-0">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Signature Placement <span className="normal-case font-normal text-gray-400">(drag to move, corner to resize)</span>
            </label>

            <SigCanvas
              xRatio={draft.xRatio}
              yRatio={draft.yRatio}
              wRatio={draft.wRatio}
              hRatio={draft.hRatio}
              onChange={handleCanvasChange}
              pdfBlob={pdfBlob}
              pageNum={draft.page}
              signerName={draft.signerName}
              signerPosition={draft.signerPosition}
              signImageBase64={draft.signImageBase64}
              imgWidthPct={draft.imgWidthPct ?? 35}
              textSizePct={draft.textSizePct ?? 18}
              imgTop={draft.imgTop ?? 5}
              imgLeft={draft.imgLeft ?? 50}
              txtTop={draft.txtTop ?? 55}
              txtLeft={draft.txtLeft ?? 50}
              onContentChange={handleContentChange}
              sigFontFamily={draft.sigFontFamily ?? 'Inter, sans-serif'}
              isBold={draft.isBold !== false}
              isItalic={draft.isItalic ?? false}
              nameColor={draft.nameColor ?? '#1e3a5f'}
              positionColor={draft.positionColor ?? '#2563eb'}
              signedByColor={draft.signedByColor ?? '#64748b'}
              showSignedBy={draft.showSignedBy ?? false}
            />


          </div>

          {/* ── RIGHT: settings ─────────────────────────────────── */}
          <div className="flex flex-col gap-3 w-72 lg:w-full shrink-0 overflow-y-auto">

            {/* P12 / PFX */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                P12 / PFX Certificate *
              </label>
              <label className="mt-1 flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-md p-2 hover:border-blue-400 transition-colors">
                <UploadIcon className="w-4 h-4 shrink-0 text-blue-500" />
                <span className="text-sm truncate text-muted-foreground">
                  {draft.fileName || 'Click to upload…'}
                </span>
                <input
                  type="file"
                  accept=".p12,.pfx"
                  className="sr-only"
                  onChange={handleP12}
                />
              </label>
              {p12Error && <p className="text-xs text-red-500 mt-0.5">{p12Error}</p>}
              {draft.fileName && !p12Error && (
                <p className="text-xs text-green-600 mt-0.5 truncate">✓ {draft.fileName}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                P12 Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400 pr-8"
                  placeholder="Leave blank if none"
                  value={draft.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOffIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Signer Name */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Signer Name
              </label>
              <textarea
                rows={2}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="Your full name (use Enter for new line)"
                value={draft.signerName}
                onChange={(e) => set('signerName', e.target.value)}
              />
            </div>

            {/* Show "Digitally Signed by:" Label */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 accent-blue-500"
                  checked={draft.showSignedBy ?? false}
                  onChange={(e) => set('showSignedBy', e.target.checked)}
                />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Show "Digitally Signed by:" Label
                </span>
              </label>
            </div>

            {/* Signer Position */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Position / Title
              </label>
              <textarea
                rows={2}
                className="w-full mt-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400 resize-none"
                placeholder="e.g., Manager, HR Director (use Enter for new line)"
                value={draft.signerPosition}
                onChange={(e) => set('signerPosition', e.target.value)}
              />
            </div>



            {/* Page to Sign (only shown when document has multiple pages) */}
            {totalPages > 1 && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Page to Sign
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    className="w-20 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                    value={draft.page}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1));
                      set('page', v);
                    }}
                  />
                  <span className="text-xs text-muted-foreground">of {totalPages}</span>
                </div>
              </div>
            )}

            {/* Signature image */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Signature Image *
              </label>
              {sigImgPreview ? (
                <div className="mt-1 relative">
                  <img src={sigImgPreview} alt="sig" className="h-12 border rounded object-contain bg-gray-50" />
                  <button
                    type="button"
                    onClick={clearSigImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <Trash2Icon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="mt-1 flex items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-md p-2 hover:border-blue-400 transition-colors">
                  <UploadIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload PNG / JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleSigImage}
                  />
                </label>
              )}
            </div>

            {/* ── Standalone Stamp Designer ── */}
            <div className="border border-gray-200 rounded-md p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Stamp Designer</label>
              </div>

              {/* Designer Preview Box */}
              <div className="flex flex-col gap-1 items-center">
                {(() => {
                  // Compute the designer box height to match the ACTUAL stamp
                  // aspect ratio on the PDF page (A4 = 595×842 points).
                  const PDF_W = 595, PDF_H = 842;
                  const desH = Math.max(40, Math.round(designerWidth * (draft.hRatio * PDF_H) / (draft.wRatio * PDF_W)));
                  return (
                    <div
                      ref={stampDesRef}
                      className="relative w-full border-2 border-blue-500 rounded-md bg-white overflow-hidden select-none"
                      style={{ height: desH, padding: 0 }}
                    >
                      {/* Canvas-based WYSIWYG preview */}
                      <StampPreview
                        cssW={designerWidth}
                        cssH={desH}
                        signImageBase64={draft.signImageBase64}
                        signerName={draft.signerName}
                        signerPosition={draft.signerPosition}
                        showSignedBy={draft.showSignedBy}
                        imgTop={draft.imgTop ?? 5}
                        imgLeft={draft.imgLeft ?? 50}
                        imgWidthPct={draft.imgWidthPct ?? 35}
                        txtTop={draft.txtTop ?? 55}
                        txtLeft={draft.txtLeft ?? 50}
                        textSizePct={draft.textSizePct ?? 18}
                        sigFontFamily={draft.sigFontFamily ?? 'Inter, sans-serif'}
                        isBold={draft.isBold !== false}
                        isItalic={draft.isItalic ?? false}
                        nameColor={draft.nameColor ?? '#1e3a5f'}
                        positionColor={draft.positionColor ?? '#2563eb'}
                        signedByColor={draft.signedByColor ?? '#64748b'}
                      />

                      {/* Transparent drag overlay for image area */}
                      <div
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => { e.preventDefault(); setDesignerDragging("img"); }}
                        style={{ zIndex: 1 }}
                      />
                      {/* Transparent drag overlay for text area — sits on top of the lower half */}
                      <div
                        className="absolute left-0 right-0 bottom-0 cursor-grab active:cursor-grabbing"
                        style={{ top: '45%', zIndex: 2 }}
                        onMouseDown={(e) => { e.preventDefault(); setDesignerDragging("txt"); }}
                      />
                    </div>
                  );
                })()}
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <MousePointer2 className="w-3 h-3" />
                  Drag to reposition
                </p>
              </div>

              {/* Box Dimensions */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Stamp Width</span>
                  </div>
                  <input
                    type="range" min="5" max="95" step="0.5"
                    className="w-full accent-blue-500"
                    value={draft.wRatio * 100}
                    onChange={(e) => updateStampSize(parseFloat(e.target.value) / 100, draft.hRatio)}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Stamp Height</span>
                  </div>
                  <input
                    type="range" min="2" max="40" step="0.5"
                    className="w-full accent-blue-500"
                    value={draft.hRatio * 100}
                    onChange={(e) => updateStampSize(draft.wRatio, parseFloat(e.target.value) / 100)}
                  />
                </div>
              </div>

              {/* Text Size & Image Width */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Text Size ({draft.textSizePct ?? 18}%)</span>
                  </div>
                  <input
                    type="range" min="5" max="50" step="1"
                    className="w-full accent-blue-500"
                    value={draft.textSizePct ?? 18}
                    onChange={(e) => set('textSizePct', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Image Width ({draft.imgWidthPct ?? 35}%)</span>
                  </div>
                  <input
                    type="range" min="5" max="100" step="1"
                    className="w-full accent-blue-500"
                    value={draft.imgWidthPct ?? 35}
                    onChange={(e) => set('imgWidthPct', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Font Family Dropdown */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-medium text-foreground">Font Family</label>
                <div className="relative" ref={fontDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setFontDropdownOpen(v => !v)}
                    className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  >
                    <span style={{ fontFamily: draft.sigFontFamily ?? 'Inter, sans-serif' }}>
                      {FONT_OPTIONS.find(f => f.value === (draft.sigFontFamily ?? 'Inter, sans-serif'))?.label ?? (draft.sigFontFamily ?? 'Inter, sans-serif')}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2 transition-transform ${fontDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {fontDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg overflow-y-auto max-h-48">
                      {FONT_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => { set('sigFontFamily', opt.value); setFontDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${(draft.sigFontFamily ?? 'Inter, sans-serif') === opt.value ? "bg-blue-50 text-blue-600" : "text-foreground"}`}
                          style={{ fontFamily: opt.value }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bold & Italic Toggles */}
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={draft.isBold !== false} onChange={e => set('isBold', e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer" />
                  <span className="text-xs text-foreground">Bold</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={draft.isItalic ?? false} onChange={e => set('isItalic', e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer" />
                  <span className="text-xs text-foreground">Italic</span>
                </label>
              </div>

              {/* Text Colors */}
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-medium text-foreground">Text Colors</label>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input type="color" value={draft.nameColor ?? '#1e3a5f'} onChange={e => set('nameColor', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0 bg-white" />
                    <label className="text-[10px] text-muted-foreground">Name</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={draft.positionColor ?? '#2563eb'} onChange={e => set('positionColor', e.target.value)}
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0 bg-white" />
                    <label className="text-[10px] text-muted-foreground">Position</label>
                  </div>
                  {draft.showSignedBy && (
                    <div className="flex items-center gap-2">
                      <input type="color" value={draft.signedByColor ?? '#64748b'} onChange={e => set('signedByColor', e.target.value)}
                        className="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0 bg-white" />
                      <label className="text-[10px] text-muted-foreground">Label</label>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ─ Actions ─ */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button variant="outline" className="text-xs h-9" onClick={handleClear}>
            Clear Settings
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" className="text-xs h-9" onClick={onClose}>
            Cancel
          </Button>
          <Button className="text-xs h-9 px-6 bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
