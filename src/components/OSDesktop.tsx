import React, { useState } from 'react';
import {
  Layers, Lock, Terminal, Award, ShieldCheck, Key,
  ArrowUpRight, Activity, Database, Zap, Cpu, User,
} from 'lucide-react';
import { TextScramble } from './TextScramble';
import { audioFX } from '../utils/audioFX';
import { Igloo3DFooter } from './Igloo3DFooter';
import { SystemMetrics } from '../types';

/* ──────────────────────────────────────────────────────────────
   Portfolio node definitions
   ────────────────────────────────────────────────────────── */
const NODES = [
  {
    id: 'architecture',
    label: 'SYSTEM BLUEPRINT',
    sublabel: 'Phase 1 Architecture',
    desc: 'Topology diagram, subject mapping, and system architecture for the decentralised enterprise OS.',
    icon: <Layers className="w-5 h-5" />,
    accent: '#4a9ab5',
    tag: 'DESIGN',
    featured: true,
  },
  {
    id: 'files',
    label: 'CRYPTOGRAPHIC VAULT',
    sublabel: 'RSA-AES Encryption',
    desc: 'Hybrid RSA-2048 / AES-256-GCM file pipeline with SHA-256 hash registry on Hyperledger Besu.',
    icon: <Lock className="w-5 h-5" />,
    accent: '#6ee7b7',
    tag: 'SECURITY',
    featured: false,
  },
  {
    id: 'auth',
    label: 'SMART ACCOUNTS',
    sublabel: 'ERC-4337 Passkeys',
    desc: 'Account abstraction with WebAuthn passkeys, session keys, and Paymaster gas sponsorship.',
    icon: <Key className="w-5 h-5" />,
    accent: '#a78bfa',
    tag: 'WEB3',
    featured: false,
  },
  {
    id: 'contracts',
    label: 'SOLIDITY STUDIO',
    sublabel: 'Besu Block Explorer',
    desc: 'Smart contract IDE with RBAC contracts, ABI inspector, Besu block explorer, and Foundry tests.',
    icon: <Terminal className="w-5 h-5" />,
    accent: '#fbbf24',
    tag: 'CONTRACTS',
    featured: false,
  },
  {
    id: 'milestones',
    label: 'MILESTONES',
    sublabel: 'Escrow Release',
    desc: 'Blockchain-enforced milestone tracking with multi-sig verifier budget release.',
    icon: <Award className="w-5 h-5" />,
    accent: '#38bdf8',
    tag: 'PROJECT',
    featured: false,
  },
  {
    id: 'security',
    label: 'SCSVS AUDIT',
    sublabel: 'Shift-Left Security',
    desc: 'Smart contract security scanner and sharded MySQL topology inspector with tamper detection.',
    icon: <ShieldCheck className="w-5 h-5" />,
    accent: '#f87171',
    tag: 'AUDIT',
    featured: false,
  },
  {
    id: 'portfolio',
    label: 'MY PORTFOLIO',
    sublabel: 'Shashank Sharma',
    desc: 'Personal portfolio — Web3 Developer, MCA Student, Blockchain & Cryptography Engineer.',
    icon: <User className="w-5 h-5" />,
    accent: '#fb923c',
    tag: 'PORTFOLIO',
    featured: false,
  },
];

interface OSDesktopProps {
  apps: { id: string; name: string; description: string; icon: React.ReactNode }[];
  metrics: SystemMetrics;
  onOpenApp: (id: string) => void;
}

export const OSDesktop: React.FC<OSDesktopProps> = ({ metrics, onOpenApp }) => {
  const [warpId, setWarpId] = useState<string | null>(null);

  const handleLaunch = (id: string) => {
    audioFX.warp();
    setWarpId(id);
    setTimeout(() => {
      audioFX.shatter();
      onOpenApp(id);
      setWarpId(null);
    }, 350);
  };

  return (
    /* Scrollable area — uses CSS vars so safe-area insets are respected */
    <div
      style={{
        position: 'fixed',
        top: 'calc(var(--navbar-h) + var(--sat))',
        left: 0,
        right: 0,
        bottom: 'calc(var(--taskbar-h) + var(--sab))',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch' as any,
        overscrollBehavior: 'contain',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px) 60px',
        }}
      >
        {/* ── Hero ─────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            className="ice-badge"
            style={{ margin: '0 auto 18px', display: 'inline-flex' }}
          >
            <span className="pulse-dot" />
            WebGL · ERC-4337 · Besu QBFT&nbsp;{metrics.qbftTps}&nbsp;TPS
          </div>

          <h1
            className="font-mono"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#e8f4f8',
              marginBottom: 16,
            }}
          >
            <TextScramble
              text="DECENTRALISED"
              delay={80}
              speed={20}
              className="text-gradient-glow"
            />
            <br />
            <TextScramble
              text="ENTERPRISE OS"
              delay={300}
              speed={20}
              showCursor
            />
          </h1>

          <p style={{
            maxWidth: 480,
            margin: '0 auto',
            fontSize: 13,
            color: 'rgba(184,217,232,0.5)',
            lineHeight: 1.7,
          }}>
            Zero-Trust blockchain-powered OS with RSA-AES cryptography, smart account abstraction, and QBFT consensus.
          </p>
        </div>

        {/* ── Metrics Strip ────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 12,
            marginBottom: 28,
          }}
        >
          {[
            { label: 'QBFT TPS',      value: `${metrics.qbftTps}`,                icon: <Activity   className="w-3.5 h-3.5" />, color: '#6ee7b7' },
            { label: 'Active Nodes',  value: `${metrics.activeNodes}`,             icon: <Cpu        className="w-3.5 h-3.5" />, color: '#b8d9e8' },
            { label: 'Blocks',        value: metrics.totalBlocks.toLocaleString(), icon: <Database   className="w-3.5 h-3.5" />, color: '#a78bfa' },
            { label: 'Paymaster ETH', value: `${metrics.paymasterGasBalance} ETH`, icon: <Zap        className="w-3.5 h-3.5" />, color: '#fbbf24' },
          ].map(m => (
            <div
              key={m.label}
              className="ice-card"
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${m.color}14`,
                border: `1px solid ${m.color}28`,
                color: m.color,
              }}>
                {m.icon}
              </div>
              <div>
                <div className="font-mono" style={{ fontSize: 16, fontWeight: 800, color: '#e8f4f8', lineHeight: 1 }}>
                  {m.value}
                </div>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)', marginTop: 4 }}>
                  {m.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Crystal Node Grid ────────────────────────────── */}
        {/* Row 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 14,
          marginBottom: 14,
        }}>
          <CrystalCard node={NODES[0]} wide warpId={warpId} onLaunch={handleLaunch} />
          <CrystalCard node={NODES[1]} warpId={warpId} onLaunch={handleLaunch} />
          <CrystalCard node={NODES[2]} warpId={warpId} onLaunch={handleLaunch} />
        </div>

        {/* Row 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
          gap: 14,
          marginBottom: 14,
        }}>
          <CrystalCard node={NODES[3]} warpId={warpId} onLaunch={handleLaunch} />
          <CrystalCard node={NODES[4]} warpId={warpId} onLaunch={handleLaunch} />
          <CrystalCard node={NODES[5]} warpId={warpId} onLaunch={handleLaunch} />
        </div>

        {/* Row 3: Portfolio — full width */}
        <div style={{ marginBottom: 28 }}>
          <CrystalCard node={NODES[6]} wide warpId={warpId} onLaunch={handleLaunch} />
        </div>

        {/* ── Shard DB Status ──────────────────────────────── */}
        <div className="ice-card" style={{ padding: '20px 22px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database className="w-4 h-4" style={{ color: '#4a9ab5' }} />
              <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.55)', fontWeight: 600 }}>
                MySQL Sharded Database Topology
              </span>
            </div>
            <span className="ice-badge online">3 / 3 ONLINE</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: 20,
          }}>
            {[
              { name: 'Shard-Alpha', ...metrics.shardedDbStatus.shardAlpha },
              { name: 'Shard-Beta',  ...metrics.shardedDbStatus.shardBeta  },
              { name: 'Shard-Gamma', ...metrics.shardedDbStatus.shardGamma },
            ].map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="font-mono" style={{ fontSize: 11, color: '#b8d9e8', fontWeight: 600 }}>{s.name}</span>
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                </div>
                <div className="ice-progress" style={{ marginBottom: 6 }}>
                  <div
                    className="ice-progress-fill"
                    style={{ width: `${Math.min(100, (s.diskUsageMb / 200) * 100)}%` }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.38)' }}>{s.records} records</span>
                  <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.38)' }}>{s.diskUsageMb} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <Igloo3DFooter />
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────
   Crystal Card — with proper mouse + touch feedback
   ────────────────────────────────────────────────────────── */
interface CrystalCardProps {
  node: typeof NODES[0];
  wide?: boolean;
  warpId: string | null;
  onLaunch: (id: string) => void;
}

const CrystalCard: React.FC<CrystalCardProps> = ({ node, wide, warpId, onLaunch }) => {
  const isWarping = warpId === node.id;
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  /* True on capacitor/touch-only devices */
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  const active  = hovered || pressed;

  const handleTouchStart = () => setPressed(true);
  const handleTouchEnd   = () => {
    setPressed(false);
    /* Flash feedback → then launch */
    setTimeout(() => onLaunch(node.id), 120);
  };
  /* Prevent touchcancel leaving stuck press */
  const handleTouchCancel = () => setPressed(false);

  return (
    <div
      className="ice-card"
      style={{
        padding: wide ? '26px' : '20px',
        cursor: 'pointer',
        opacity:     isWarping ? 0.55 : 1,
        transform:   isWarping ? 'scale(0.97)' : pressed ? 'scale(0.973)' : hovered ? 'translateY(-3px)' : 'none',
        transition:  'opacity 0.3s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.2s',
        borderColor: active ? `${node.accent}60` : undefined,
        boxShadow:   active ? `0 0 30px ${node.accent}25, 0 16px 48px -12px rgba(0,0,0,0.55)` : undefined,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: wide ? 'clamp(140px, 18vw, 200px)' : 'clamp(120px, 16vw, 170px)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      /* Desktop mouse */
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={isTouch ? undefined : () => onLaunch(node.id)}
      /* Mobile touch */
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: active ? `${node.accent}26` : `${node.accent}14`,
          border: `1px solid ${active ? node.accent + '55' : node.accent + '28'}`,
          color: node.accent,
          transition: 'background 0.2s, border-color 0.2s',
        }}>
          {node.icon}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 9, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 9px', borderRadius: 6,
              background: `${node.accent}10`,
              border: `1px solid ${node.accent}22`,
              color: node.accent,
            }}
          >
            {node.tag}
          </span>
          <ArrowUpRight className="w-3.5 h-3.5" style={{
            color: `${node.accent}60`,
            transform: active ? 'translate(2px, -2px)' : 'none',
            transition: 'transform 0.2s',
          }} />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${node.accent}80`, marginBottom: 5 }}>
          {node.sublabel}
        </div>
        <div
          className="font-mono"
          style={{ fontSize: wide ? 15 : 13, fontWeight: 700, color: '#e8f4f8', marginBottom: 8, lineHeight: 1.3 }}
        >
          <TextScramble text={node.label} delay={0} speed={18} triggerOnHover />
        </div>
        <p style={{ fontSize: 11, color: 'rgba(184,217,232,0.48)', lineHeight: 1.6 }}>
          {node.desc}
        </p>
      </div>

      {/* CTA — always visible on touch with accent glow, subtle on desktop */}
      <div
        className="font-mono"
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: `1px solid ${active ? node.accent + '30' : node.accent + '18'}`,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: active ? node.accent : `${node.accent}55`,
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        <Zap className="w-3 h-3" style={{
          transform: active ? 'scale(1.25)' : 'scale(1)',
          transition: 'transform 0.2s',
        }} />
        {isTouch ? 'TAP TO OPEN' : 'ENTER CRYSTAL NODE'}
      </div>
    </div>
  );
};
