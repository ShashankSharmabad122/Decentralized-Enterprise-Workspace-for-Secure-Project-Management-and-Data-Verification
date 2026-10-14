import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Maximize2, Minimize2 } from 'lucide-react';
import { audioFX } from '../utils/audioFX';

/* ──────────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */
interface Rect { x: number; y: number; w: number; h: number }
type ResizeDir = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

const MIN_W = 380;
const MIN_H = 260;

/* ──────────────────────────────────────────────────────────────
   Per-window layout persistence (localStorage)
   ────────────────────────────────────────────────────────── */
function loadRect(id: string, fallback: Rect): Rect {
  try {
    const raw = localStorage.getItem(`dos-win-${id}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}
function saveRect(id: string, rect: Rect) {
  try { localStorage.setItem(`dos-win-${id}`, JSON.stringify(rect)); }
  catch {}
}

/* ──────────────────────────────────────────────────────────────
   Device hook
   ────────────────────────────────────────────────────────── */
function useDeviceCategory() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  if (w < 600)  return 'mobile'  as const;
  if (w < 1024) return 'tablet'  as const;
  return         'desktop' as const;
}

/* ──────────────────────────────────────────────────────────────
   Resize handle descriptors
   ────────────────────────────────────────────────────────── */
const HANDLES: { dir: ResizeDir; cursor: string; style: React.CSSProperties }[] = [
  // ── Edges
  { dir: 'n',  cursor: 'n-resize',  style: { top: 0,    left: 12, right: 12, height: 7 } },
  { dir: 's',  cursor: 's-resize',  style: { bottom: 0, left: 12, right: 12, height: 7 } },
  { dir: 'e',  cursor: 'e-resize',  style: { right: 0,  top: 12, bottom: 12, width: 7  } },
  { dir: 'w',  cursor: 'w-resize',  style: { left: 0,   top: 12, bottom: 12, width: 7  } },
  // ── Corners
  { dir: 'nw', cursor: 'nw-resize', style: { top: 0,    left: 0,   width: 14, height: 14 } },
  { dir: 'ne', cursor: 'ne-resize', style: { top: 0,    right: 0,  width: 14, height: 14 } },
  { dir: 'se', cursor: 'se-resize', style: { bottom: 0, right: 0,  width: 14, height: 14 } },
  { dir: 'sw', cursor: 'sw-resize', style: { bottom: 0, left: 0,   width: 14, height: 14 } },
];

/* ──────────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────── */
interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isFocused: boolean;
  onClose: () => void;
  onFocus: () => void;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  children: React.ReactNode;
}

/* ──────────────────────────────────────────────────────────────
   WindowFrame
   ────────────────────────────────────────────────────────── */
export const WindowFrame: React.FC<WindowFrameProps> = ({
  id, title, icon, isOpen, isFocused,
  onClose, onFocus,
  defaultPosition, defaultSize,
  children,
}) => {
  const device   = useDeviceCategory();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  /* ── State ────────────────────────────────────────────── */
  const initialRect: Rect = {
    x: defaultPosition.x,
    y: defaultPosition.y,
    w: isTablet
      ? Math.min(defaultSize.width,  window.innerWidth  - 24)
      : defaultSize.width,
    h: isTablet
      ? Math.min(defaultSize.height, window.innerHeight - 140)
      : defaultSize.height,
  };

  const [rect,      setRect]      = useState<Rect>(() => loadRect(id, initialRect));
  const [minimised, setMinimised] = useState(false);
  const [maximised, setMaximised] = useState(false);
  /* Store rect before maximise so we can restore */
  const preMaxRect = useRef<Rect | null>(null);

  /* Reset minimised on re-open */
  useEffect(() => { if (isOpen) setMinimised(false); }, [isOpen]);

  /* Persist rect to localStorage whenever it changes */
  useEffect(() => {
    if (!isMobile && !maximised && isOpen) saveRect(id, rect);
  }, [rect, isMobile, maximised, isOpen, id]);

  /* ── Helpers ──────────────────────────────────────────── */
  const clampRect = useCallback((r: Rect): Rect => ({
    x: Math.max(0,  Math.min(r.x, window.innerWidth  - MIN_W)),
    y: Math.max(50, Math.min(r.y, window.innerHeight - MIN_H)),
    w: Math.max(MIN_W, Math.min(r.w, window.innerWidth  - 4)),
    h: Math.max(MIN_H, Math.min(r.h, window.innerHeight - 60)),
  }), []);

  /* ── Drag title bar (desktop + tablet) ───────────────── */
  const dragRef = useRef<{ mx: number; my: number; rx: number; ry: number } | null>(null);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    dragRef.current = { mx: clientX, my: clientY, rx: rect.x, ry: rect.y };
    onFocus();
  }, [rect.x, rect.y, onFocus]);

  const onTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isMobile || maximised) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const { mx, my, rx, ry } = dragRef.current;
      setRect(prev => clampRect({ ...prev, x: rx + ev.clientX - mx, y: ry + ev.clientY - my }));
    };
    const onUp = () => { dragRef.current = null; window.removeEventListener('mousemove', onMove); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',  onUp, { once: true });
  };

  const onTitleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isMobile || maximised) return;
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  };
  const onTitleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragRef.current || isMobile || maximised) return;
    const t = e.touches[0];
    const { mx, my, rx, ry } = dragRef.current;
    setRect(prev => clampRect({ ...prev, x: rx + t.clientX - mx, y: ry + t.clientY - my }));
  };
  const onTitleTouchEnd = () => { dragRef.current = null; };

  /* ── Resize ───────────────────────────────────────────── */
  const startResize = useCallback((
    dir: ResizeDir,
    clientX: number,
    clientY: number,
    onMove: (dx: number, dy: number) => void,
    cleanup: () => void,
  ) => {
    const startX = clientX, startY = clientY;
    const startRect = { ...rect };

    const move = (ev: MouseEvent | TouchEvent) => {
      const cx = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;
      const cy = 'touches' in ev ? ev.touches[0].clientY : (ev as MouseEvent).clientY;
      const dx = cx - startX, dy = cy - startY;

      setRect(() => {
        let { x, y, w, h } = startRect;

        if (dir.includes('e')) w = Math.max(MIN_W, startRect.w + dx);
        if (dir.includes('s')) h = Math.max(MIN_H, startRect.h + dy);
        if (dir.includes('w')) {
          const nw = Math.max(MIN_W, startRect.w - dx);
          x = startRect.x + (startRect.w - nw);
          w = nw;
        }
        if (dir.includes('n')) {
          const nh = Math.max(MIN_H, startRect.h - dy);
          y = startRect.y + (startRect.h - nh);
          h = nh;
        }

        return clampRect({ x, y, w, h });
      });
    };

    window.addEventListener('mousemove', move as EventListener);
    window.addEventListener('touchmove', move as EventListener, { passive: false });
    const up = () => {
      window.removeEventListener('mousemove', move as EventListener);
      window.removeEventListener('touchmove', move as EventListener);
      window.removeEventListener('mouseup',  up);
      window.removeEventListener('touchend', up);
      cleanup();
    };
    window.addEventListener('mouseup',  up, { once: true });
    window.addEventListener('touchend', up, { once: true });
    onFocus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rect, clampRect, onFocus]);

  const onResizeMouseDown = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (maximised) return;
    startResize(dir, e.clientX, e.clientY, () => {}, () => {});
  };

  const onResizeTouchStart = (dir: ResizeDir) => (e: React.TouchEvent) => {
    e.stopPropagation();
    if (maximised || isMobile) return;
    startResize(dir, e.touches[0].clientX, e.touches[0].clientY, () => {}, () => {});
  };

  /* ── Maximise toggle ──────────────────────────────────── */
  const handleMaximise = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFX.click();
    if (!maximised) {
      preMaxRect.current = { ...rect };
      setMaximised(true);
    } else {
      setMaximised(false);
      if (preMaxRect.current) setRect(preMaxRect.current);
    }
    setMinimised(false);
  };

  const handleMinimise = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFX.click();
    setMinimised(m => !m);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioFX.click();
    onClose();
  };

  /* ── Double-click title to maximise ──────────────────── */
  const onTitleDblClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isMobile) return;
    handleMaximise(e);
  };

  /* ── Derived styles ───────────────────────────────────── */
  const isFull = isMobile || maximised;

  const frameStyle: React.CSSProperties = isFull
    ? {}
    : {
        left:   rect.x,
        top:    rect.y,
        width:  rect.w,
        height: minimised ? 'auto' : rect.h,
      };

  if (!isOpen) return null;

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div
      className={[
        'window-frame',
        isFocused ? 'focused' : '',
        isFull    ? 'mobile-full' : '',
        maximised ? 'maximised' : '',
      ].join(' ')}
      style={{
        ...frameStyle,
        zIndex: isFocused ? 60 : 50,
        /* Smooth transition only for maximise, not for drag/resize */
        transition: maximised || !isFull
          ? 'box-shadow 0.2s, border-color 0.2s'
          : undefined,
      }}
      onMouseDown={onFocus}
    >
      {/* ── Resize handles (desktop + tablet only) ─────── */}
      {!isFull && !minimised && HANDLES.map(h => (
        <div
          key={h.dir}
          className={`wf-resize-handle wf-resize-${h.dir}`}
          style={{
            position: 'absolute',
            zIndex: 10,
            cursor: h.cursor,
            ...h.style,
          }}
          onMouseDown={onResizeMouseDown(h.dir)}
          onTouchStart={onResizeTouchStart(h.dir)}
        />
      ))}

      {/* Corner resize visual indicators */}
      {!isFull && !minimised && ['ne', 'se', 'sw', 'nw'].map(corner => (
        <div
          key={`vi-${corner}`}
          className={`wf-corner-indicator wf-corner-${corner}`}
        />
      ))}

      {/* ── Title Bar ────────────────────────────────────── */}
      <div
        className="window-titlebar"
        onMouseDown={onTitleMouseDown}
        onDoubleClick={onTitleDblClick}
        onTouchStart={onTitleTouchStart}
        onTouchMove={onTitleTouchMove}
        onTouchEnd={onTitleTouchEnd}
        style={{
          cursor: isFull ? 'default' : 'move',
          height: isMobile ? 50 : 44,
          padding: isMobile ? '0 12px' : '0 14px',
          gap: 8,
        }}
      >
        {/* ─ Window controls ────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button className="wf-btn close" onClick={handleClose} title="Close">
            <X strokeWidth={2.5} style={{ width: 11, height: 11 }} />
            <span className="wf-btn-label">Close</span>
          </button>

          {!isMobile && (
            <button className="wf-btn min" onClick={handleMinimise} title={minimised ? 'Restore' : 'Minimise'}>
              <Minus strokeWidth={2.5} style={{ width: 11, height: 11 }} />
              <span className="wf-btn-label">{minimised ? 'Restore' : 'Min'}</span>
            </button>
          )}

          {!isMobile && (
            <button className="wf-btn max" onClick={handleMaximise} title={maximised ? 'Restore' : 'Maximise'}>
              {maximised
                ? <Minimize2 strokeWidth={2.5} style={{ width: 11, height: 11 }} />
                : <Maximize2 strokeWidth={2.5} style={{ width: 11, height: 11 }} />
              }
              <span className="wf-btn-label">{maximised ? 'Restore' : 'Max'}</span>
            </button>
          )}
        </div>

        {/* ─ Divider ────────────────────────────────────── */}
        <div style={{ width: 1, height: 16, background: 'rgba(74,154,181,0.15)', flexShrink: 0 }} />

        {/* ─ Icon + title ───────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
          {icon && (
            <span style={{ color: '#4a9ab5', opacity: 0.65, flexShrink: 0, display: 'flex' }}>
              {icon}
            </span>
          )}
          <span
            className="font-mono"
            style={{
              fontSize: 11,
              color: isFocused ? 'rgba(184,217,232,0.75)' : 'rgba(184,217,232,0.4)',
              letterSpacing: '0.04em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}
          >
            {title}
          </span>
        </div>

        {/* ─ Size indicator (shown during resize/not maximised) */}
        {!isFull && !minimised && (
          <span
            className="font-mono wf-size-indicator"
            style={{
              fontSize: 9,
              color: 'rgba(74,154,181,0.4)',
              letterSpacing: '0.06em',
              flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {Math.round(rect.w)}×{Math.round(rect.h)}
          </span>
        )}

        {/* ─ Focus dot ──────────────────────────────────── */}
        {isFocused && (
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#4a9ab5',
            boxShadow: '0 0 8px rgba(74,154,181,0.8)',
            flexShrink: 0,
          }} />
        )}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {!minimised && (
        <div className="window-content">
          {children}
        </div>
      )}
    </div>
  );
};
