
import { useState, useRef, useCallback, useEffect } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ShieldCheck, Upload, Eye, EyeOff,
  FileSignature, CheckCircle2, XCircle, AlertCircle, Loader2, X, File as FileIcon,
  PenIcon, RefreshCw, GripVertical,
} from 'lucide-react'
import { decryptString } from '@/screens/user/attendance-record/printDTR/cryptoUtils'

const DEFAULT_SERVER = import.meta.env.VITE_PNPKI_SERVER
const STORAGE_KEY = 'pnpki_config'

// ── pdfjs CDN loader ──────────────────────────────────────────────────────────
let _pdfjs: any = null
function loadPdfJs(): Promise<any> {
  if (_pdfjs) return Promise.resolve(_pdfjs)
  if ((window as any).pdfjsLib) {
    _pdfjs = (window as any).pdfjsLib
    return Promise.resolve(_pdfjs)
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    s.onload = () => {
      const lib = (window as any).pdfjsLib
      lib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      _pdfjs = lib
      resolve(lib)
    }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

// ── Load & decrypt pnpki_config from localStorage ────────────────────────────

interface StoredConfig {
  p12Base64?: string
  fileName?: string
  password?: string
  signerName?: string
  signerPosition?: string
  signNote?: string        // legacy key
  page?: number
  signAllPages?: boolean
  xRatio?: number
  yRatio?: number
  wRatio?: number
  hRatio?: number
  serverUrl?: string
  signImageBase64?: string
  signImageFileName?: string
  signTextScale?: number
  signTextOffsetX?: number
  signTextOffsetY?: number
  signImageScale?: number
  signImageOffsetX?: number
  signImageOffsetY?: number
  sigFontSize?: number
  sigFontFamily?: string
  sigTextColor?: string
}

async function loadPNPKIConfig(): Promise<StoredConfig | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: StoredConfig = JSON.parse(raw)
    // backwards-compat: migrate signNote → signerPosition
    if (parsed.signNote !== undefined && parsed.signerPosition === undefined) {
      parsed.signerPosition = parsed.signNote
      delete parsed.signNote
    }
    if (parsed.p12Base64) parsed.p12Base64 = await decryptString(parsed.p12Base64)
    if (parsed.password)  parsed.password  = await decryptString(parsed.password)
    return parsed
  } catch {
    return null
  }
}

// ── Compose sign design canvas → PNG blob ───────────────────────────────────
async function buildSignDesignBlob(opts: {
  signImageBase64?: string
  signerName: string; signNote: string
  signTextScale: number; signTextOffsetX: number; signTextOffsetY: number
  signImageScale: number; signImageOffsetX: number; signImageOffsetY: number
  sigFontSize: number; sigFontFamily: string; sigTextColor: string
  wRatio: number; hRatio: number
}): Promise<Blob | null> {
  const W = 1000
  const H = Math.max(160, Math.round(W * (opts.hRatio / opts.wRatio)))
  const canvas = document.createElement('canvas')
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')!

  if (opts.signImageBase64) {
    await new Promise<void>(resolve => {
      const img = new Image()
      img.onload = () => {
        const scale      = opts.signImageScale
        const contW      = scale * W
        const contH      = scale * H
        const imgAspect  = img.naturalWidth / Math.max(1, img.naturalHeight)
        const contAspect = contW / contH
        let drawW: number, drawH: number
        if (imgAspect >= contAspect) { drawW = contW; drawH = contW / imgAspect }
        else                         { drawH = contH; drawW = contH * imgAspect }
        const contX = opts.signImageOffsetX * W
        const contY = opts.signImageOffsetY * H
        ctx.drawImage(img, contX + (contW - drawW) / 2, contY + (contH - drawH) / 2, drawW, drawH)
        resolve()
      }
      img.onerror = () => resolve()
      img.src = `data:image/png;base64,${opts.signImageBase64}`
    })
  }

  const fontSize   = opts.sigFontSize / 100 * H * opts.signTextScale
  const lines      = [opts.signerName || 'Signer', ...(opts.signNote ? [opts.signNote] : [])]
  ctx.fillStyle    = opts.sigTextColor
  ctx.textBaseline = 'top'
  const textX = opts.signTextOffsetX * W
  const textY = opts.signTextOffsetY * H
  const lineH = fontSize * 1.35
  lines.forEach((line, i) => {
    ctx.font = i === 0 ? `bold ${fontSize}px ${opts.sigFontFamily}` : `${fontSize}px ${opts.sigFontFamily}`
    ctx.fillText(line, textX, textY + i * lineH)
  })

  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
}

// ── Signature placement canvas ────────────────────────────────────────────────
interface SigCanvasProps {
  pdfBlob: Blob | null
  pageNum: number
  xRatio: number; yRatio: number; wRatio: number; hRatio: number
  onChange: (x: number, y: number, w: number, h: number) => void
  signerName: string; signNote: string; signImageBase64?: string
  signTextScale: number; signTextOffsetX: number; signTextOffsetY: number
  signImageScale: number; signImageOffsetX: number; signImageOffsetY: number
  onContentChange: (ox: number, oy: number, scale: number, type: 'text' | 'image') => void
  sigFontSize: number; sigFontFamily: string; sigTextColor: string
}

function SigCanvas({
  pdfBlob, pageNum, xRatio, yRatio, wRatio, hRatio, onChange,
  signerName, signNote, signImageBase64,
  signTextScale, signTextOffsetX, signTextOffsetY,
  signImageScale, signImageOffsetX, signImageOffsetY, onContentChange,
  sigFontSize, sigFontFamily, sigTextColor,
}: SigCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgCanvasRef  = useRef<HTMLCanvasElement>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfReady,   setPdfReady]   = useState(false)
  const [containerH, setContainerH] = useState(0)

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const ro = new ResizeObserver(e => setContainerH(e[0].contentRect.height))
    ro.observe(el); return () => ro.disconnect()
  }, [])

  const dragging        = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null)
  const resizing        = useRef<{ startX: number; startY: number; origW: number; origH: number } | null>(null)
  const contentDragging = useRef<{ startX: number; startY: number; origOX: number; origOY: number; type: 'text' | 'image' } | null>(null)
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

  // Render PDF page
  useEffect(() => {
    if (!pdfBlob) { setPdfReady(false); return }
    let cancelled = false
    setPdfLoading(true); setPdfReady(false)
    ;(async () => {
      try {
        const pdfjs = await loadPdfJs(); if (cancelled) return
        const ab  = await pdfBlob.arrayBuffer()
        const doc = await pdfjs.getDocument({ data: ab }).promise
        const pg  = await doc.getPage(Math.min(pageNum, doc.numPages)); if (cancelled) return
        const canvas = bgCanvasRef.current; if (!canvas) return
        const containerW = containerRef.current?.clientWidth || 600
        const raw = pg.getViewport({ scale: 1 })
        const scale = containerW / raw.width
        const vp = pg.getViewport({ scale })
        canvas.width = vp.width; canvas.height = vp.height
        await pg.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise
        if (!cancelled) { setPdfReady(true); setPdfLoading(false) }
      } catch { if (!cancelled) setPdfLoading(false) }
    })()
    return () => { cancelled = true }
  }, [pdfBlob, pageNum])

  const onMouseDownBox = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dragging.current = { startX: e.clientX, startY: e.clientY, origX: xRatio, origY: yRatio }
  }, [xRatio, yRatio])

  const onMouseDownResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    resizing.current = { startX: e.clientX, startY: e.clientY, origW: wRatio, origH: hRatio }
  }, [wRatio, hRatio])

  const onMouseDownText = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    contentDragging.current = { startX: e.clientX, startY: e.clientY, origOX: signTextOffsetX, origOY: signTextOffsetY, type: 'text' }
  }, [signTextOffsetX, signTextOffsetY])

  const onMouseDownImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    contentDragging.current = { startX: e.clientX, startY: e.clientY, origOX: signImageOffsetX, origOY: signImageOffsetY, type: 'image' }
  }, [signImageOffsetX, signImageOffsetY])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      if (dragging.current) {
        const dx = (e.clientX - dragging.current.startX) / rect.width
        const dy = (e.clientY - dragging.current.startY) / rect.height
        onChange(
          clamp(dragging.current.origX + dx, 0, 1 - wRatio),
          clamp(dragging.current.origY + dy, 0, 1 - hRatio),
          wRatio, hRatio,
        )
      }
      if (resizing.current) {
        const dw = (e.clientX - resizing.current.startX) / rect.width
        const dh = (e.clientY - resizing.current.startY) / rect.height
        onChange(
          xRatio, yRatio,
          clamp(resizing.current.origW + dw, 0.05, 1 - xRatio),
          clamp(resizing.current.origH + dh, 0.02, 1 - yRatio),
        )
      }
      if (contentDragging.current) {
        const boxW = rect.width  * wRatio
        const boxH = rect.height * hRatio
        const dx = (e.clientX - contentDragging.current.startX) / boxW
        const dy = (e.clientY - contentDragging.current.startY) / boxH
        const { type } = contentDragging.current
        onContentChange(
          clamp(contentDragging.current.origOX + dx, 0, 1),
          clamp(contentDragging.current.origOY + dy, 0, 1),
          type === 'image' ? signImageScale : signTextScale,
          type,
        )
      }
    }
    const onUp = () => { dragging.current = null; resizing.current = null; contentDragging.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [xRatio, yRatio, wRatio, hRatio, onChange, onContentChange, signImageScale, signTextScale])

  const pct     = (v: number) => `${(v * 100).toFixed(2)}%`
  const sigBoxH = (containerH || 300) * hRatio
  const fontPx  = Math.max(4, sigFontSize / 100 * sigBoxH) * signTextScale

  return (
    <div className="flex flex-col gap-1 h-full">
      <p className="text-xs text-muted-foreground text-center select-none">
        Drag <strong>blue bar</strong> to move · <strong>⌟</strong> corner to resize · drag <strong>content</strong> to reposition
      </p>
      <div
        ref={containerRef}
        className="relative w-full border border-gray-300 shadow-inner select-none overflow-hidden bg-white"
        style={pdfReady ? {} : { aspectRatio: '1 / 1.414' }}
      >
        <canvas ref={bgCanvasRef} className="block w-full" style={{ display: pdfReady ? 'block' : 'none' }} />

        {!pdfReady && (
          <div className="absolute inset-0 bg-white">
            {[0.25, 0.5, 0.75].map(v => (
              <div key={`h${v}`} className="absolute w-full border-t border-dashed border-gray-100" style={{ top: pct(v) }} />
            ))}
            {[0.25, 0.5, 0.75].map(v => (
              <div key={`v${v}`} className="absolute h-full border-l border-dashed border-gray-100" style={{ left: pct(v) }} />
            ))}
          </div>
        )}

        {pdfLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="ml-2 text-xs text-muted-foreground">Loading PDF…</span>
          </div>
        )}

        {/* Signature box overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute border-2 border-blue-400 border-dashed rounded cursor-move overflow-hidden"
            style={{
              left: pct(xRatio), top: pct(yRatio),
              width: pct(wRatio), height: pct(hRatio),
              pointerEvents: 'all',
              background: 'rgba(255,255,255,0.55)',
            }}
          >
            {/* Grip bar – dragging moves the box */}
            <div
              onMouseDown={onMouseDownBox}
              className="absolute top-0 left-0 right-0 flex items-center justify-center z-20"
              style={{ height: 14, background: 'rgba(59,130,246,0.75)', cursor: 'move', pointerEvents: 'all' }}
            >
              <GripVertical style={{ width: 12, height: 12, color: 'white', opacity: 0.9, transform: 'rotate(90deg)' }} />
            </div>

            {/* Content area */}
            <div className="w-full h-full relative overflow-hidden" style={{ paddingTop: 14 }}>
              {signImageBase64 && (
                <img
                  src={`data:image/png;base64,${signImageBase64}`}
                  draggable={false}
                  onMouseDown={onMouseDownImage}
                  style={{
                    position: 'absolute',
                    left: `${signImageOffsetX * 100}%`, top: `${signImageOffsetY * 100}%`,
                    width: `${signImageScale * 100}%`, height: `${signImageScale * 100}%`,
                    objectFit: 'contain', cursor: 'grab', pointerEvents: 'all',
                  }}
                />
              )}
              <div
                onMouseDown={onMouseDownText}
                style={{
                  position: 'absolute',
                  left: `${signTextOffsetX * 100}%`, top: `${signTextOffsetY * 100}%`,
                  fontSize: `${fontPx}px`, fontFamily: sigFontFamily,
                  lineHeight: 1.35, color: sigTextColor,
                  cursor: 'grab', pointerEvents: 'all', userSelect: 'none', whiteSpace: 'nowrap',
                  display: 'flex', flexDirection: 'column', padding: '0 4px',
                }}
              >
                <span style={{ fontWeight: 700 }}>{signerName || 'Signer Name'}</span>
                {signNote && <span>{signNote}</span>}
              </div>
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={onMouseDownResize}
              className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize rounded-tl z-10 flex items-center justify-center"
              style={{ fontSize: 8, color: 'white', lineHeight: 1 }}
            >⌟</div>
          </div>
        </div>
      </div>

      {/* Numeric readout */}
      <div className="grid grid-cols-4 gap-1 text-[10px] text-muted-foreground text-center">
        {([['X', xRatio], ['Y', yRatio], ['W', wRatio], ['H', hRatio]] as [string, number][]).map(([l, v]) => (
          <div key={l} className="bg-muted rounded px-1 py-0.5 font-mono">{l}: {v.toFixed(3)}</div>
        ))}
      </div>
    </div>
  )
}

// ── Drop zone ─────────────────────────────────────────────────────────────────

function DropZone({
  label, accept, file, onFile, onClear,
}: {
  label: string
  accept: string
  file: File | null
  onFile: (f: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files[0]
      if (f) onFile(f)
    },
    [onFile],
  )

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        dragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
          : 'border-muted-foreground/30 hover:border-muted-foreground/60'
      }`}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }}
      />
      {file ? (
        <div className="flex items-center gap-2 justify-center">
          <FileIcon size={15} className="text-blue-500 shrink-0" />
          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
          <button
            type="button"
            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
            onClick={e => { e.stopPropagation(); onClear() }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <Upload size={18} />
          <span className="text-xs">{label}</span>
        </div>
      )}
    </div>
  )
}

// ── Info row (verify results) ─────────────────────────────────────────────────

function Row({
  label, value, ok, bad,
}: { label: string; value?: string; ok?: boolean; bad?: boolean }) {
  return (
    <div className="flex gap-1">
      <span className="text-muted-foreground shrink-0 w-28">{label}:</span>
      <span
        className={`font-medium break-all ${
          ok ? 'text-green-600 dark:text-green-400' : bad ? 'text-red-500' : ''
        }`}
      >
        {value ?? '—'}
      </span>
    </div>
  )
}

// ── Friendly error mapper ────────────────────────────────────────────────────
function humanizeServerError(raw: string): string {
  const s = raw.toLowerCase()
  if (s.includes('orphaned generation') || s.includes('has an orphaned'))
    return 'Cannot sign: the PDF appears to be tampered or structurally corrupted (orphaned object detected). Please use the original, unmodified file.'
  if (s.includes('password') || s.includes('mac verify') || s.includes('bad decrypt'))
    return 'Incorrect certificate password. Please check your P12/PFX password and try again.'
  if (s.includes('no such file') || s.includes('not found'))
    return 'A required file was not found on the server. Please re-upload and try again.'
  if (s.includes('permission') || s.includes('certify') || s.includes('locked'))
    return 'This PDF is locked or certified and does not permit additional signatures.'
  if (s.includes('already signed') || s.includes('signature exists'))
    return 'The PDF already contains a signature in this field.'
  return raw
}

function SignPanel() {
  const [pdfFile, setPdfFile]             = useState<File | null>(null)
  const [pdfBlob, setPdfBlob]             = useState<Blob | null>(null)
  const [p12File, setP12File]             = useState<File | null>(null)
  const [signImageFile, setSignImageFile] = useState<File | null>(null)
  const [password, setPassword]           = useState('')
  const [showPass, setShowPass]           = useState(false)
  const [signerName, setSignerName]       = useState('')
  const [signNote, setSignNote]           = useState('')
  const [page, setPage]                   = useState(1)
  const [signAllPages, setSignAllPages]   = useState(false)
  const [xRatio, setXRatio]               = useState(0.55)
  const [yRatio, setYRatio]               = useState(0.87)
  const [wRatio, setWRatio]               = useState(0.38)
  const [hRatio, setHRatio]               = useState(0.06)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [signedBlob, setSignedBlob]       = useState<Blob | null>(null)
  const [signedName, setSignedName]       = useState('')
  const [configLoaded, setConfigLoaded]   = useState(false)
  const [configLoading, setConfigLoading] = useState(false)

  // Appearance / visual states
  const [signImageBase64, setSignImageBase64]   = useState<string | undefined>()
  const [signTextScale, setSignTextScale]       = useState(1)
  const [signTextOffsetX, setSignTextOffsetX]   = useState(0)
  const [signTextOffsetY, setSignTextOffsetY]   = useState(0)
  const [signImageScale, setSignImageScale]     = useState(1)
  const [signImageOffsetX, setSignImageOffsetX] = useState(0)
  const [signImageOffsetY, setSignImageOffsetY] = useState(0)
  const [sigFontSize, setSigFontSize]           = useState(10)
  const [sigFontFamily, setSigFontFamily]       = useState('Arial, sans-serif')
  const [sigTextColor, setSigTextColor]         = useState('#1e3a5f')

  // Keep preview blob in sync: show signed PDF if available, else original
  const previewBlob = signedBlob ?? pdfBlob

  const applyConfig = useCallback(async () => {
    setConfigLoading(true)
    setConfigLoaded(false)
    const cfg = await loadPNPKIConfig()
    setConfigLoading(false)
    if (!cfg) return

    if (cfg.signerName)     setSignerName(cfg.signerName)
    if (cfg.signerPosition) setSignNote(cfg.signerPosition)
    if (cfg.page)           setPage(cfg.page)
    if (cfg.signAllPages !== undefined) setSignAllPages(cfg.signAllPages)
    if (cfg.xRatio !== undefined) setXRatio(cfg.xRatio)
    if (cfg.yRatio !== undefined) setYRatio(cfg.yRatio)
    if (cfg.wRatio !== undefined) setWRatio(cfg.wRatio)
    if (cfg.hRatio !== undefined) setHRatio(cfg.hRatio)
    if (cfg.password)       setPassword(cfg.password)

    // Visual fields
    if (cfg.signImageBase64)               setSignImageBase64(cfg.signImageBase64)
    if (cfg.signTextScale  !== undefined)  setSignTextScale(cfg.signTextScale)
    if (cfg.signTextOffsetX !== undefined) setSignTextOffsetX(cfg.signTextOffsetX)
    if (cfg.signTextOffsetY !== undefined) setSignTextOffsetY(cfg.signTextOffsetY)
    if (cfg.signImageScale  !== undefined) setSignImageScale(cfg.signImageScale)
    if (cfg.signImageOffsetX !== undefined) setSignImageOffsetX(cfg.signImageOffsetX)
    if (cfg.signImageOffsetY !== undefined) setSignImageOffsetY(cfg.signImageOffsetY)
    if (cfg.sigFontSize   !== undefined) setSigFontSize(cfg.sigFontSize)
    if (cfg.sigFontFamily) setSigFontFamily(cfg.sigFontFamily)
    if (cfg.sigTextColor)  setSigTextColor(cfg.sigTextColor)

    // Reconstruct P12 File from decrypted base64
    if (cfg.p12Base64 && cfg.fileName) {
      try {
        const bytes = Uint8Array.from(atob(cfg.p12Base64), c => c.charCodeAt(0))
        setP12File(new File([bytes], cfg.fileName, { type: 'application/x-pkcs12' }))
      } catch { /* ignore */ }
    }

    // Reconstruct sign image File from raw base64
    if (cfg.signImageBase64 && cfg.signImageFileName) {
      try {
        const bytes = Uint8Array.from(atob(cfg.signImageBase64), c => c.charCodeAt(0))
        setSignImageFile(new File([bytes], cfg.signImageFileName, { type: 'image/png' }))
      } catch { /* ignore */ }
    }

    setConfigLoaded(true)
  }, [])

  // Auto-load on mount
  useEffect(() => { applyConfig() }, [applyConfig])

  const canSign = !!(pdfFile && p12File)

  // Update pdfBlob when pdfFile changes
  useEffect(() => {
    if (!pdfFile) { setPdfBlob(null); return }
    pdfFile.arrayBuffer().then(buf => setPdfBlob(new Blob([buf], { type: 'application/pdf' })))
  }, [pdfFile])

  // Whenever a new image is uploaded via DropZone, read its base64 for SigCanvas
  useEffect(() => {
    if (!signImageFile) return
    const reader = new FileReader()
    reader.onload = () => setSignImageBase64((reader.result as string).split(',')[1])
    reader.readAsDataURL(signImageFile)
  }, [signImageFile])

  const handleCanvasChange = useCallback((x: number, y: number, w: number, h: number) => {
    setXRatio(x); setYRatio(y); setWRatio(w); setHRatio(h)
  }, [])

  const handleContentChange = useCallback((ox: number, oy: number, scale: number, type: 'text' | 'image') => {
    if (type === 'image') { setSignImageOffsetX(ox); setSignImageOffsetY(oy); setSignImageScale(scale) }
    else                  { setSignTextOffsetX(ox);  setSignTextOffsetY(oy);  setSignTextScale(scale)  }
  }, [])

  const handleSign = async () => {
    if (!pdfFile || !p12File) return
    setLoading(true)
    setError(null)
    setSignedBlob(null)

    // Build the composed sign design PNG so server renders exactly what we preview
    const designBlob = await buildSignDesignBlob({
      signImageBase64, signerName, signNote,
      signTextScale, signTextOffsetX, signTextOffsetY,
      signImageScale, signImageOffsetX, signImageOffsetY,
      sigFontSize, sigFontFamily, sigTextColor,
      wRatio, hRatio,
    })

    const fd = new FormData()
    fd.append('pdf_file', pdfFile)
    fd.append('p12_file', p12File)
    fd.append('password', password)
    fd.append('signer_name', signerName)
    fd.append('sign_note', signNote)
    fd.append('page', String(page))
    fd.append('sign_all_pages', signAllPages ? 'true' : 'false')
    fd.append('x_ratio', String(xRatio))
    fd.append('y_ratio', String(yRatio))
    fd.append('w_ratio', String(wRatio))
    fd.append('h_ratio', String(hRatio))
    // Send composed design (takes priority on server); keep raw image as fallback
    if (designBlob) fd.append('sign_design', new File([designBlob], 'sign-design.png', { type: 'image/png' }))
    if (signImageFile) fd.append('sign_image', signImageFile)

    const server = DEFAULT_SERVER.replace(/\/$/, '')
    try {
      const res = await fetch(`${server}/sign-pdf`, { method: 'POST', body: fd })
      if (!res.ok) {
        const text = await res.text()
        setError(humanizeServerError(text || `Server error ${res.status}`))
      } else {
        const blob = await res.blob()
        const stem = pdfFile.name.replace(/\.pdf$/i, '')
        const name = `${stem}-signed.pdf`
        setSignedBlob(blob)
        setSignedName(name)
        // Auto-download
        const url = URL.createObjectURL(blob)
        const a = Object.assign(document.createElement('a'), { href: url, download: name })
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Could not reach signing server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-row md:flex-col gap-6">
      {/* ── Form column ── */}
      <div className="flex flex-col gap-4 w-80 md:w-full shrink-0 overflow-y-auto">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs">
          {configLoading ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Loader2 size={12} className="animate-spin" /> Loading config…
            </span>
          ) : configLoaded ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle2 size={12} /> Loaded from <span className="font-mono">pnpki_config</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              <AlertCircle size={12} /> No saved config found
            </span>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs gap-1 text-muted-foreground"
          onClick={applyConfig}
          disabled={configLoading}
        >
          <RefreshCw size={11} className={configLoading ? 'animate-spin' : ''} />
          Reload
        </Button>
      </div>

      {/* File uploads */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">
            PDF to Sign <span className="text-red-500">*</span>
          </Label>
          <DropZone
            label="Drop or click — PDF"
            accept=".pdf"
            file={pdfFile}
            onFile={f => { setPdfFile(f); setSignedBlob(null) }}
            onClear={() => { setPdfFile(null); setSignedBlob(null) }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">
            P12 / PFX Certificate <span className="text-red-500">*</span>
          </Label>
          <DropZone
            label="Drop or click — P12/PFX"
            accept=".p12,.pfx"
            file={p12File}
            onFile={setP12File}
            onClear={() => setP12File(null)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium text-muted-foreground">Certificate Password</Label>
        <div className="relative">
          <Input
            type={showPass ? 'text' : 'password'}
            placeholder="Leave blank if none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="pr-9"
          />
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowPass(p => !p)}
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Signer info */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">
            Signer Name <span className="opacity-50">(optional override)</span>
          </Label>
          <Input
            placeholder="From certificate if blank"
            value={signerName}
            onChange={e => setSignerName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs font-medium text-muted-foreground">
            Sign Note / Role <span className="opacity-50">(optional)</span>
          </Label>
          <Input
            placeholder="e.g. HR Officer"
            value={signNote}
            onChange={e => setSignNote(e.target.value)}
          />
        </div>
      </div>

      {/* Page */}
      <div className="flex items-end gap-4">
        <div className="flex flex-col gap-1 w-32">
          <Label className="text-xs font-medium text-muted-foreground">Page Number</Label>
          <Input
            type="number"
            min={1}
            value={page}
            onChange={e => setPage(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={signAllPages}
          />
        </div>
        <label className="flex items-center gap-2 pb-2 cursor-pointer select-none">
          <input
            id="sign-all"
            type="checkbox"
            className="w-4 h-4 accent-blue-500"
            checked={signAllPages}
            onChange={e => setSignAllPages(e.target.checked)}
          />
          <span className="text-sm">Sign all pages</span>
        </label>
      </div>

      {/* Optional signature image */}
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium text-muted-foreground">
          Signature Image <span className="opacity-50">(optional)</span>
        </Label>
        <DropZone
          label="Drop or click — PNG / JPG"
          accept="image/*"
          file={signImageFile}
          onFile={f => setSignImageFile(f)}
          onClear={() => { setSignImageFile(null); setSignImageBase64(undefined) }}
        />
      </div>

      {/* Text appearance */}
      <div className="border border-border rounded-md p-3 flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Text Appearance</Label>
        <div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Font Size</span>
            <span className="text-xs font-mono text-muted-foreground">{sigFontSize}% of box</span>
          </div>
          <input type="range" min="2" max="30" step="1" className="w-full accent-blue-500"
            value={sigFontSize} onChange={e => setSigFontSize(parseInt(e.target.value))} />
        </div>
        <div>
          <span className="text-xs text-muted-foreground block mb-1">Font</span>
          <select className="w-full border border-input rounded-md px-2 py-1 text-xs bg-background outline-none focus:border-blue-400"
            value={sigFontFamily} onChange={e => setSigFontFamily(e.target.value)}>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Segoe UI', Arial, sans-serif">Segoe UI</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Courier New', Courier, monospace">Courier New</option>
            <option value="cursive">Cursive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex-1">Color</span>
          <input type="color" className="w-8 h-7 rounded cursor-pointer border border-input"
            value={sigTextColor} onChange={e => setSigTextColor(e.target.value)} />
          <span className="text-xs font-mono text-muted-foreground">{sigTextColor}</span>
        </div>
      </div>

      {/* Content scale */}
      {signImageBase64 ? (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-medium text-muted-foreground">Image Scale ({(signImageScale * 100).toFixed(0)}%)</Label>
            <button type="button" className="text-[10px] text-blue-500 hover:underline"
              onClick={() => { setSignImageScale(1); setSignImageOffsetX(0); setSignImageOffsetY(0) }}>Reset</button>
          </div>
          <input type="range" min="0.3" max="2" step="0.05" className="w-full accent-blue-500"
            value={signImageScale} onChange={e => setSignImageScale(parseFloat(e.target.value))} />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-medium text-muted-foreground">Text Scale ({(signTextScale * 100).toFixed(0)}%)</Label>
            <button type="button" className="text-[10px] text-blue-500 hover:underline"
              onClick={() => { setSignTextScale(1); setSignTextOffsetX(0); setSignTextOffsetY(0) }}>Reset</button>
          </div>
          <input type="range" min="0.3" max="2.5" step="0.05" className="w-full accent-blue-500"
            value={signTextScale} onChange={e => setSignTextScale(parseFloat(e.target.value))} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      <Button disabled={!canSign || loading} onClick={handleSign} className="w-full gap-2 mt-1">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <PenIcon size={16} />}
        {loading ? 'Signing…' : 'Sign & Download PDF'}
      </Button>      </div>{/* end form column */}

      {/* ── Preview column ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {signedBlob ? '✅ Signed — drag box to reposition and sign again' : 'Drag the blue bar to position the signature box'}
          </span>
          {signedBlob && (
            <Button
            variant="outline"
              className="text-[10px] text-blue-500 hover:underline"
              
              onClick={() => {
                const url = URL.createObjectURL(signedBlob)
                const a = Object.assign(document.createElement('a'), { href: url, download: signedName })
                a.click(); URL.revokeObjectURL(url)
              }}
            >
              ↓ Download again
            </Button>
          )}
        </div>
        <SigCanvas
          pdfBlob={previewBlob}
          pageNum={page}
          xRatio={xRatio} yRatio={yRatio} wRatio={wRatio} hRatio={hRatio}
          onChange={handleCanvasChange}
          signerName={signerName} signNote={signNote} signImageBase64={signImageBase64}
          signTextScale={signTextScale} signTextOffsetX={signTextOffsetX} signTextOffsetY={signTextOffsetY}
          signImageScale={signImageScale} signImageOffsetX={signImageOffsetX} signImageOffsetY={signImageOffsetY}
          onContentChange={handleContentChange}
          sigFontSize={sigFontSize} sigFontFamily={sigFontFamily} sigTextColor={sigTextColor}
        />
      </div>    </div>
  )
}

// ── Verify canvas (PDF.js + clickable sig overlays) ─────────────────────────
interface VerifyCanvasProps {
  pdfBlob: Blob | null
  pageNum: number
  totalPages: number
  onPageChange: (p: number) => void
  onLoad?: (numPages: number) => void
  results: SigResult[] | null
  selectedIndex: number | null
  onSelect: (i: number) => void
}

function VerifyCanvas({ pdfBlob, pageNum, totalPages, onPageChange, onLoad, results, selectedIndex, onSelect }: VerifyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bgCanvasRef  = useRef<HTMLCanvasElement>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfReady,   setPdfReady]   = useState(false)
  // Native canvas dimensions (pixels) — used for rect conversion
  const [nativeW, setNativeW] = useState(0)
  const [nativeH, setNativeH] = useState(0)
  // PDF page natural size in pts — needed for coordinate flip
  const [pdfPtsW, setPdfPtsW] = useState(0)
  const [pdfPtsH, setPdfPtsH] = useState(0)

  useEffect(() => {
    if (!pdfBlob) { setPdfReady(false); return }
    let cancelled = false
    setPdfLoading(true); setPdfReady(false)
    ;(async () => {
      try {
        const pdfjs = await loadPdfJs(); if (cancelled) return
        const ab  = await pdfBlob.arrayBuffer()
        const doc = await pdfjs.getDocument({ data: ab }).promise
        const pg  = await doc.getPage(Math.min(pageNum, doc.numPages)); if (cancelled) return
        const canvas = bgCanvasRef.current; if (!canvas) return
        const containerW = containerRef.current?.clientWidth || 600
        const rawVp = pg.getViewport({ scale: 1 })
        const scale = containerW / rawVp.width
        const vp = pg.getViewport({ scale })
        canvas.width = vp.width; canvas.height = vp.height
        await pg.render({ canvasContext: canvas.getContext('2d')!, viewport: vp }).promise
        if (!cancelled) {
          setNativeW(vp.width); setNativeH(vp.height)
          setPdfPtsW(rawVp.width); setPdfPtsH(rawVp.height)
          setPdfReady(true); setPdfLoading(false)
          onLoad?.(doc.numPages)
        }
      } catch { if (!cancelled) setPdfLoading(false) }
    })()
    return () => { cancelled = true }
  }, [pdfBlob, pageNum])

  // Convert a PDF-space rect [x1,y1,x2,y2] (bottom-left origin, pts) to CSS % on canvas
  const pdfRectToCss = (rect: number[]) => {
    if (!pdfPtsW || !pdfPtsH || !nativeW || !nativeH) return null
    const [x1, y1, x2, y2] = rect
    const left   = (x1 / pdfPtsW) * 100
    const top    = ((pdfPtsH - y2) / pdfPtsH) * 100
    const width  = ((x2 - x1) / pdfPtsW) * 100
    const height = ((y2 - y1) / pdfPtsH) * 100
    return { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }
  }

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`

  return (
    <div className="flex flex-col gap-1 h-full">
      <div
        ref={containerRef}
        className="relative w-full border border-gray-300 shadow-inner select-none overflow-hidden bg-white"
        style={pdfReady ? {} : { aspectRatio: '1 / 1.414' }}
      >
        <canvas ref={bgCanvasRef} className="block w-full" style={{ display: pdfReady ? 'block' : 'none' }} />

        {!pdfReady && !pdfLoading && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-2 text-muted-foreground">
            {[0.25, 0.5, 0.75].map(v => (
              <div key={`h${v}`} className="absolute w-full border-t border-dashed border-gray-100" style={{ top: pct(v) }} />
            ))}
            {[0.25, 0.5, 0.75].map(v => (
              <div key={`v${v}`} className="absolute h-full border-l border-dashed border-gray-100" style={{ left: pct(v) }} />
            ))}
            <FileSignature size={32} className="opacity-20 z-10" />
            <span className="text-xs z-10">Upload a PDF to preview</span>
          </div>
        )}

        {pdfLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="ml-2 text-xs text-muted-foreground">Loading PDF…</span>
          </div>
        )}

        {/* Signature overlays */}
        {pdfReady && results && results.map((sig, i) => {
          if (!sig.rect || sig.page !== undefined && sig.page !== pageNum) return null
          const css = pdfRectToCss(sig.rect)
          if (!css) return null
          const isOk  = !sig.error && sig.valid && sig.intact
          const isErr = !!sig.error
          const isSel = selectedIndex === i
          const color = isErr ? 'rgba(234,179,8,0.45)' : isOk ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'
          const border = isErr ? '#ca8a04' : isOk ? '#16a34a' : '#dc2626'
          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className="absolute cursor-pointer transition-all"
              style={{
                ...css,
                background: color,
                border: `2px solid ${border}`,
                borderRadius: 2,
                boxShadow: isSel ? `0 0 0 3px ${border}80` : undefined,
                outline: isSel ? `2px solid ${border}` : undefined,
                zIndex: isSel ? 20 : 10,
              }}
            >
              <span
                className="absolute -top-4 left-0 text-[9px] font-semibold px-1 py-0.5 rounded-sm whitespace-nowrap"
                style={{ background: border, color: 'white', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {sig.field_name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <button
            type="button"
            disabled={pageNum <= 1}
            className="px-2 py-0.5 rounded border border-input disabled:opacity-40 hover:bg-muted transition-colors"
            onClick={() => onPageChange(pageNum - 1)}
          >←</button>
          <span>Page {pageNum} / {totalPages}</span>
          <button
            type="button"
            disabled={pageNum >= totalPages}
            className="px-2 py-0.5 rounded border border-input disabled:opacity-40 hover:bg-muted transition-colors"
            onClick={() => onPageChange(pageNum + 1)}
          >→</button>
        </div>
      )}
    </div>
  )
}

// ── Verify Panel ──────────────────────────────────────────────────────────────

interface SigResult {
  field_name: string
  signer?: string
  issuer?: string
  not_before?: string
  not_after?: string
  signed_at?: string
  intact?: boolean
  valid?: boolean
  modification_level?: string
  coverage?: string
  rect?: number[] | null
  page?: number
  error?: string
}

function VerifyPanel() {
  const [pdfFile, setPdfFile]     = useState<File | null>(null)
  const [pdfBlob, setPdfBlob]     = useState<Blob | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [results, setResults]     = useState<SigResult[] | null>(null)
  const [info, setInfo]           = useState<string | null>(null)
  const [selectedSig, setSelectedSig] = useState<number | null>(null)
  const [viewPage, setViewPage]       = useState(1)
  const [totalPages, setTotalPages]   = useState(1)

  const handleSelectSig = useCallback((i: number) => {
    setSelectedSig(i)
    const sig = results?.[i]
    if (sig?.page) setViewPage(sig.page)
  }, [results])

  // Update pdfBlob when pdfFile changes
  useEffect(() => {
    if (!pdfFile) { setPdfBlob(null); return }
    pdfFile.arrayBuffer().then(buf => setPdfBlob(new Blob([buf], { type: 'application/pdf' })))
  }, [pdfFile])

  const handleVerify = async () => {
    if (!pdfFile) return
    setLoading(true)
    setError(null)
    setResults(null)
    setInfo(null)

    const fd = new FormData()
    fd.append('pdf_file', pdfFile)

    const server = DEFAULT_SERVER.replace(/\/$/, '')
    try {
      const res = await fetch(`${server}/verify-pdf`, { method: 'POST', body: fd })
      if (!res.ok) {
        const text = await res.text()
        setError(humanizeServerError(text || `Server error ${res.status}`))
      } else {
        const data = await res.json() as { signatures: SigResult[]; message?: string }
        setResults(data.signatures ?? [])
        if (data.message) setInfo(data.message)
      }
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Could not reach verification server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-row md:flex-col gap-6">
      {/* ── Form column ── */}
      <div className="flex flex-col gap-4 w-80 md:w-full shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <Label className="text-xs font-medium text-muted-foreground">
          Signed PDF <span className="text-red-500">*</span>
        </Label>
        <DropZone
          label="Drop or click — signed PDF"
          accept=".pdf"
          file={pdfFile}
          onFile={f => { setPdfFile(f); setResults(null); setError(null); setInfo(null); setSelectedSig(null); setViewPage(1) }}
          onClear={() => { setPdfFile(null); setPdfBlob(null); setResults(null); setError(null); setInfo(null); setSelectedSig(null); setViewPage(1) }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      {/* No signatures notice */}
      {info && !error && results?.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 rounded-md p-3">
          <AlertCircle size={15} className="shrink-0" />
          <span>{info}</span>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (() => {
        const selSig = selectedSig !== null ? results[selectedSig] : null
        const isOkSel    = selSig ? (!selSig.error && selSig.valid && selSig.intact) : false
        const isErrorSel = selSig ? !!selSig.error : false

        return (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              {results.length} signature{results.length !== 1 ? 's' : ''} found
            </p>

            {/* Compact signature list */}
            <div className="flex flex-col gap-1">
              {results.map((sig, i) => {
                const isOk  = !sig.error && sig.valid && sig.intact
                const isErr = !!sig.error
                const isSel = selectedSig === i
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectSig(i)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-md border text-xs text-left transition-all cursor-pointer hover:brightness-95 active:scale-[0.99] ${
                      isSel ? 'ring-2 ring-blue-400' : ''
                    } ${
                      isErr
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
                        : isOk
                        ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                        : 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    }`}
                  >
                    <span className="font-medium truncate">{sig.field_name}</span>
                    {isErr ? (
                      <AlertCircle size={13} className="text-yellow-600 shrink-0" />
                    ) : isOk ? (
                      <CheckCircle2 size={13} className="text-green-600 dark:text-green-400 shrink-0" />
                    ) : (
                      <XCircle size={13} className="text-red-500 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Detail card for selected signature */}
            {selSig && (
              <div className={`rounded-lg border p-4 flex flex-col gap-2 text-sm ${
                isErrorSel
                  ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
                  : isOkSel
                  ? 'border-green-400 bg-green-50 dark:bg-green-950/20'
                  : 'border-red-400 bg-red-50 dark:bg-red-950/20'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{selSig.field_name}</span>
                  {isErrorSel ? (
                    <span className="flex items-center gap-1 text-yellow-600 text-xs shrink-0">
                      <AlertCircle size={13} /> Validation error
                    </span>
                  ) : isOkSel ? (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs shrink-0">
                      <CheckCircle2 size={13} /> Valid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500 text-xs shrink-0">
                      <XCircle size={13} /> Invalid
                    </span>
                  )}
                </div>

                {isErrorSel ? (
                  <p className="text-yellow-700 dark:text-yellow-300 text-xs break-all">{selSig.error}</p>
                ) : (
                  <div className="grid grid-cols-1 gap-y-1 text-xs">
                    <Row label="Signer"        value={selSig.signer} />
                    <Row label="Issuer"        value={selSig.issuer} />
                    <Row label="Signed At"     value={selSig.signed_at} />
                    <Row label="Cert Valid"    value={`${selSig.not_before} → ${selSig.not_after}`} />
                    <Row label="Intact"        value={selSig.intact ? 'Yes' : 'No'} ok={selSig.intact} bad={!selSig.intact} />
                    <Row label="Trusted"       value={selSig.valid ? 'Yes' : 'No'} ok={selSig.valid} bad={!selSig.valid} />
                    {selSig.modification_level && <Row label="Modification" value={selSig.modification_level} />}
                    {selSig.coverage           && <Row label="Coverage"     value={selSig.coverage} />}
                    {selSig.page               && <Row label="Page"         value={String(selSig.page)} />}
                    {selSig.rect               && <Row label="Box (pts)"    value={selSig.rect.map(n => n.toFixed(1)).join(', ')} />}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })()}

      <Button disabled={!pdfFile || loading} onClick={handleVerify} className="w-full gap-2 mt-1">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
        {loading ? 'Verifying…' : 'Verify Signatures'}
      </Button>
      </div>{/* end form column */}

      {/* ── Preview column ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {results && results.length > 0 ? 'Click a signature card to highlight it on the PDF' : 'PDF Preview'}
        </span>
        <VerifyCanvas
          pdfBlob={pdfBlob}
          pageNum={viewPage}
          totalPages={totalPages}
          onPageChange={setViewPage}
          onLoad={setTotalPages}
          results={results}
          selectedIndex={selectedSig}
          onSelect={handleSelectSig}
        />
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

function PNPKI() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pnpki-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <header className="border-b px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileSignature size={19} className="text-blue-500" />
            <span className="font-semibold text-base">PNPKI PDF Signer</span>
          </div>
          <ModeToggle />
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center py-8 px-4 overflow-y-auto">
          <div className="w-full max-w-6xl">
            <Tabs defaultValue="sign">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="sign" className="flex-1 gap-1.5">
                  <PenIcon size={13} /> Sign PDF
                </TabsTrigger>
                <TabsTrigger value="verify" className="flex-1 gap-1.5">
                  <ShieldCheck size={13} /> Verify PDF
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sign">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Sign a PDF Document</CardTitle>
                    <CardDescription>
                      Upload a PDF and your PNPKI P12 certificate. Drag the blue signature box on the preview to set its position, then sign.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SignPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verify">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Verify PDF Signatures</CardTitle>
                    <CardDescription>
                      Inspect the validity of all digital signatures embedded in a PDF file.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VerifyPanel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t px-6 py-2 text-xs text-muted-foreground text-center shrink-0">
          Default server: <span className="font-mono">{DEFAULT_SERVER}</span>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default PNPKI