import React, { useState, useEffect } from 'react';
import {
  Layers, Lock, Terminal, Award, ShieldCheck, Key,
  HardDrive, ChevronDown, LogOut,
  Volume2, VolumeX, User, Menu, X,
} from 'lucide-react';
import { TextScramble } from './TextScramble';
import { SSLogo } from './SSLogo';
import { audioFX } from '../utils/audioFX';
import { UserAccount, SystemMetrics } from '../types';

interface OSNavbarProps {
  user: UserAccount;
  metrics: SystemMetrics;
  onOpenApp: (id: string) => void;
  activeAppCount: number;
  onLockSession: () => void;
}

const NAV_APPS = [
  { id: 'architecture', label: 'Blueprint',  icon: <Layers    className="w-3.5 h-3.5" /> },
  { id: 'files',        label: 'Vault',       icon: <Lock      className="w-3.5 h-3.5" /> },
  { id: 'auth',         label: 'Accounts',    icon: <Key       className="w-3.5 h-3.5" /> },
  { id: 'contracts',    label: 'Contracts',   icon: <Terminal  className="w-3.5 h-3.5" /> },
  { id: 'milestones',   label: 'Milestones',  icon: <Award     className="w-3.5 h-3.5" /> },
  { id: 'security',     label: 'Security',    icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'portfolio',    label: 'Portfolio',   icon: <User      className="w-3.5 h-3.5" /> },
];

export const OSNavbar: React.FC<OSNavbarProps> = ({
  user, metrics, onOpenApp, activeAppCount, onLockSession,
}) => {
  const [muted,       setMuted]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  /* Close drawer on resize to desktop */
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setDrawerOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  /* Close drawer/profile on outside click */
  useEffect(() => {
    if (!drawerOpen && !profileOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.igloo-navbar') && !t.closest('.mobile-nav-drawer') && !t.closest('.profile-dropdown')) {
        setDrawerOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen, profileOpen]);

  const handleNav = (id: string) => {
    audioFX.click();
    onOpenApp(id);
    setDrawerOpen(false);
  };

  const toggleMute = () => {
    const m = audioFX.toggle();
    setMuted(m);
    audioFX.click();
  };

  return (
    <>
      <header className="igloo-navbar">
        {/* ── Logo ─────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 24, flexShrink: 0 }}>
          <SSLogo size={30} variant="ice" />
          <span
            className="font-mono"
            style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.18em', color: '#b8d9e8' }}
          >
            dOS
          </span>
          <span
            className="font-mono desktop-only"
            style={{ fontSize: '0.75rem', color: 'rgba(122,184,208,0.5)', borderLeft: '1px solid rgba(74,154,181,0.2)', paddingLeft: 10 }}
          >
            Decentralized OS
          </span>
        </div>

        {/* ── Nav Links (lg+) ───────────────────────────── */}
        <nav style={{ display: 'none', alignItems: 'center', gap: 4, flex: 1 }} className="lg-nav">
          {NAV_APPS.map(app => (
            <button
              key={app.id}
              onClick={() => handleNav(app.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                fontSize: '0.75rem', fontWeight: 500,
                color: 'rgba(184,217,232,0.65)',
                fontFamily: 'var(--font-body)',
                background: 'transparent', border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#e8f4f8';
                (e.currentTarget as HTMLElement).style.background = 'rgba(74,154,181,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(184,217,232,0.65)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {app.icon}
              {app.label}
            </button>
          ))}
        </nav>

        {/* ── Right side ───────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

          {/* Network status — hide on very small screens */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pulse-dot" />
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'rgba(110,231,183,0.8)' }}>
              QBFT
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'rgba(184,217,232,0.45)' }}>
              {metrics.qbftTps} TPS
            </span>
          </div>

          <div className="desktop-only" style={{ width: 1, height: 16, background: 'rgba(74,154,181,0.2)' }} />

          {/* Block count */}
          <div
            className="desktop-only font-mono"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(184,217,232,0.45)' }}
          >
            <HardDrive style={{ width: 12, height: 12, color: '#4a9ab5' }} />
            {metrics.totalBlocks.toLocaleString()} blocks
          </div>

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8,
              color: muted ? 'rgba(184,217,232,0.3)' : 'rgba(184,217,232,0.65)',
              transition: 'all 0.15s',
            }}
            title={muted ? 'Unmute audio' : 'Mute audio'}
          >
            {muted ? <VolumeX style={{ width: 16, height: 16 }} /> : <Volume2 style={{ width: 16, height: 16 }} />}
          </button>

          {/* Profile */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { audioFX.click(); setProfileOpen(p => !p); setDrawerOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 12,
                background: profileOpen ? 'rgba(74,154,181,0.15)' : 'rgba(74,154,181,0.07)',
                border: '1px solid rgba(74,154,181,0.2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div
                style={{
                  width: 24, height: 24, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(74,154,181,0.3)',
                  fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#e8f4f8',
                  flexShrink: 0,
                }}
              >
                {user.avatar}
              </div>
              <span
                className="desktop-only"
                style={{ fontSize: '0.75rem', fontWeight: 500, color: '#b8d9e8' }}
              >
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown style={{ width: 12, height: 12, color: 'rgba(184,217,232,0.45)', flexShrink: 0 }} />
            </button>

            {profileOpen && (
              <div
                className="profile-dropdown"
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  width: 260, borderRadius: 18, padding: 4, zIndex: 200,
                  background: 'rgba(4, 13, 20, 0.97)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(74,154,181,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  /* Keep on screen on mobile */
                  maxWidth: 'calc(100vw - 28px)',
                }}
              >
                <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(74,154,181,0.1)' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#e8f4f8' }}>{user.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#4a9ab5' }}>{user.role}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: 'rgba(184,217,232,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.address}
                  </p>
                </div>

                <div style={{ padding: '8px 12px' }}>
                  {[
                    { label: 'Paymaster',   value: user.paymasterBalance, color: '#6ee7b7' },
                    { label: 'Session Key', value: `${user.sessionKey.slice(0, 16)}…`, color: '#b8d9e8' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 4px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'rgba(184,217,232,0.6)' }}>
                      <span>{r.label}</span>
                      <span style={{ color: r.color, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ padding: 4, borderTop: '1px solid rgba(74,154,181,0.1)' }}>
                  <button
                    onClick={() => { setProfileOpen(false); onLockSession(); audioFX.warp(); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 12px', borderRadius: 12,
                      fontSize: '0.75rem', fontWeight: 500,
                      color: 'rgba(252,165,165,0.8)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <LogOut style={{ width: 14, height: 14 }} />
                    Lock Smart Account Session
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Hamburger (< lg) ─────────────────────────── */}
          <button
            className="hamburger-btn"
            onClick={() => { audioFX.click(); setDrawerOpen(d => !d); setProfileOpen(false); }}
            style={{
              display: 'none', /* shown via inline style below via JS */
              alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 10,
              background: drawerOpen ? 'rgba(74,154,181,0.15)' : 'rgba(74,154,181,0.07)',
              border: '1px solid rgba(74,154,181,0.2)',
              color: '#b8d9e8', cursor: 'pointer',
            }}
            aria-label="Toggle navigation menu"
          >
            {drawerOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Nav Drawer ─────────────────────────────── */}
      {drawerOpen && (
        <div className="mobile-nav-drawer">
          {NAV_APPS.map(app => (
            <button
              key={app.id}
              onClick={() => handleNav(app.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 12,
                fontSize: '0.875rem', fontWeight: 500,
                color: 'rgba(184,217,232,0.8)',
                fontFamily: 'var(--font-body)',
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#e8f4f8';
                (e.currentTarget as HTMLElement).style.background = 'rgba(74,154,181,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(184,217,232,0.8)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <span style={{ color: '#4a9ab5', display: 'flex' }}>{app.icon}</span>
              {app.label}
            </button>
          ))}

          {/* Network status in drawer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', marginTop: 4,
            borderTop: '1px solid rgba(74,154,181,0.1)',
            fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
          }}>
            <span className="pulse-dot" />
            <span style={{ color: 'rgba(110,231,183,0.8)' }}>QBFT {metrics.qbftTps} TPS</span>
            <span style={{ color: 'rgba(184,217,232,0.35)', marginLeft: 'auto' }}>
              {metrics.totalBlocks.toLocaleString()} blocks
            </span>
          </div>
        </div>
      )}

      {/* Responsive styles injected via style tag */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-nav { display: flex !important; }
          .hamburger-btn { display: none !important; }
        }
        @media (max-width: 1023px) {
          .lg-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (max-width: 600px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
};
