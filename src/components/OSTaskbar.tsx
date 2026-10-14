import React, { useRef, useEffect, useCallback } from 'react';
import { Layers, Lock, Terminal, Award, ShieldCheck, Key, User } from 'lucide-react';
import { gsap } from 'gsap';
import { audioFX } from '../utils/audioFX';

interface AppInfo { id: string; name: string; icon: React.ReactNode }

interface OSTaskbarProps {
  apps: AppInfo[];
  activeApps: string[];
  focusedAppId: string | null;
  onOpenApp: (id: string) => void;
  onToggleFocus: (id: string) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  architecture: <Layers    className="w-5 h-5" />,
  files:        <Lock      className="w-5 h-5" />,
  auth:         <Key       className="w-5 h-5" />,
  contracts:    <Terminal  className="w-5 h-5" />,
  milestones:   <Award     className="w-5 h-5" />,
  security:     <ShieldCheck className="w-5 h-5" />,
  portfolio:    <User      className="w-5 h-5" />,
};

const SHORT: Record<string, string> = {
  architecture: 'Blueprint',
  files:        'Vault',
  auth:         'Accounts',
  contracts:    'Studio',
  milestones:   'Goals',
  security:     'Audit',
  portfolio:    'Portfolio',
};

/* ── Dock magnification constants ──────────────────────────── */
const BASE_SIZE   = 48;   // px  — resting icon box size
const MAX_SCALE   = 1.75; // peak scale at cursor
const NEIGHBOUR   = 120;  // px  — influence radius
const EASE_OUT    = 'power3.out';
const EASE_IN     = 'power2.inOut';

export const OSTaskbar: React.FC<OSTaskbarProps> = ({
  apps, activeApps, focusedAppId, onOpenApp, onToggleFocus,
}) => {
  const dockRef  = useRef<HTMLDivElement>(null);
  const btnRefs  = useRef<(HTMLButtonElement | null)[]>([]);

  /* ── Magnification on mouse move ──────────────────────────── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dockRef.current) return;
    const mouseX = e.clientX;

    btnRefs.current.forEach((btn) => {
      if (!btn) return;
      const rect   = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const dist   = Math.abs(mouseX - center);

      let scale: number;
      if (dist > NEIGHBOUR) {
        scale = 1;
      } else {
        // cosine falloff for buttery smooth magnification
        scale = 1 + (MAX_SCALE - 1) * Math.cos((dist / NEIGHBOUR) * (Math.PI / 2));
      }

      gsap.to(btn, {
        scale,
        // Rise from the bottom like macOS — transform-origin is bottom-center
        transformOrigin: '50% 100%',
        duration: 0.25,
        ease: EASE_OUT,
        overwrite: 'auto',
      });
    });
  }, []);

  /* ── Reset all icons when mouse leaves dock ───────────────── */
  const handleMouseLeave = useCallback(() => {
    btnRefs.current.forEach((btn) => {
      if (!btn) return;
      gsap.to(btn, {
        scale: 1,
        transformOrigin: '50% 100%',
        duration: 0.45,
        ease: EASE_IN,
        overwrite: 'auto',
      });
    });
  }, []);

  /* ── Attach / detach listeners ────────────────────────────── */
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    dock.addEventListener('mousemove', handleMouseMove);
    dock.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      dock.removeEventListener('mousemove', handleMouseMove);
      dock.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  /* ── Bounce-launch animation on click ────────────────────── */
  const handleClick = useCallback((btn: HTMLButtonElement | null, id: string, isActive: boolean) => {
    audioFX.click();

    if (btn) {
      gsap.timeline()
        .to(btn, { scale: 0.85, transformOrigin: '50% 100%', duration: 0.1, ease: 'power2.in' })
        .to(btn, { scale: MAX_SCALE * 0.9, duration: 0.18, ease: 'back.out(2)' })
        .to(btn, { scale: 1, duration: 0.35, ease: EASE_IN });
    }

    if (isActive) onToggleFocus(id);
    else          onOpenApp(id);
  }, [onOpenApp, onToggleFocus]);

  return (
    <>
      {/* ── Dock pill ─────────────────────────────────────────── */}
      <div
        ref={dockRef}
        className="igloo-taskbar dock-macos"
        style={{ zIndex: 100, alignItems: 'flex-end' }}
      >
        {apps.map((app, i) => {
          const isActive  = activeApps.includes(app.id);
          const isFocused = focusedAppId === app.id;

          return (
            <button
              key={app.id}
              ref={el => { btnRefs.current[i] = el; }}
              onClick={() => handleClick(btnRefs.current[i], app.id, isActive)}
              title={app.name}
              className="dock-icon-btn"
              data-active={isActive ? 'true' : 'false'}
              data-focused={isFocused ? 'true' : 'false'}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                width: BASE_SIZE,
                height: BASE_SIZE,
                padding: 0,
                flexShrink: 0,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                outline: 'none',
                transformOrigin: '50% 100%',
              }}
            >
              {/* Icon container */}
              <span
                className="dock-icon-inner"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 14,
                  background: isFocused
                    ? 'linear-gradient(135deg, rgba(74,154,181,0.4) 0%, rgba(30,122,154,0.3) 100%)'
                    : isActive
                      ? 'linear-gradient(135deg, rgba(74,154,181,0.18) 0%, rgba(30,122,154,0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                  border: isFocused
                    ? '1px solid rgba(74,154,181,0.55)'
                    : isActive
                      ? '1px solid rgba(74,154,181,0.28)'
                      : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isFocused
                    ? '0 0 20px rgba(74,154,181,0.35), 0 2px 8px rgba(0,0,0,0.5)'
                    : '0 2px 8px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(8px)',
                  color: isFocused
                    ? '#e8f4f8'
                    : isActive
                      ? 'rgba(184,217,232,0.8)'
                      : 'rgba(184,217,232,0.45)',
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s',
                }}
              >
                {ICONS[app.id] ?? app.icon}
              </span>

              {/* Active dot */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isFocused ? 5 : 4,
                    height: isFocused ? 5 : 4,
                    borderRadius: '50%',
                    background: isFocused ? '#7ab8d0' : 'rgba(74,154,181,0.7)',
                    boxShadow: isFocused ? '0 0 8px rgba(122,184,208,0.8)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              )}

              {/* Tooltip label */}
              <span className="dock-tooltip font-mono">
                {SHORT[app.id] ?? app.name.slice(0, 8)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Styles ────────────────────────────────────────────── */}
      <style>{`
        /* Dock overrides for macOS-style bottom-anchored layout */
        .igloo-taskbar.dock-macos {
          gap: 8px;
          padding: 10px 18px 14px;
          border-radius: 22px;
          overflow: visible !important;  /* allow scaled icons to overflow */
          bottom: 18px;
          bottom: calc(18px + var(--sab));
        }

        /* Tooltip */
        .dock-tooltip {
          position: absolute;
          bottom: calc(100% + 14px);
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          white-space: nowrap;
          background: rgba(4,13,20,0.92);
          border: 1px solid rgba(74,154,181,0.2);
          border-radius: 6px;
          padding: 3px 8px;
          color: rgba(184,217,232,0.8);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          backdrop-filter: blur(12px);
          z-index: 999;
        }

        .dock-icon-btn:hover .dock-tooltip {
          opacity: 1;
        }

        /* Mobile: scrollable, no magnification */
        @media (max-width: 600px) {
          .igloo-taskbar.dock-macos {
            bottom: calc(10px + var(--sab));
            left: 12px;
            right: 12px;
            transform: none;
            width: calc(100vw - 24px);
            justify-content: flex-start;
            border-radius: 18px;
            overflow-x: auto !important;
            overflow-y: hidden !important;
          }
          .dock-icon-btn { width: 42px !important; height: 42px !important; }
          .dock-tooltip { display: none !important; }
        }
      `}</style>
    </>
  );
};
