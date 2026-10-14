import React, { useState, useEffect } from 'react';
import {
  Layers, Lock, Terminal, Award, ShieldCheck, Key,
  Fingerprint, Shield, User,
} from 'lucide-react';

import { OSNavbar }    from './components/OSNavbar';
import { OSDesktop }   from './components/OSDesktop';
import { OSTaskbar }   from './components/OSTaskbar';
import { WindowFrame } from './components/WindowFrame';
import { Igloo3DCanvas } from './components/Igloo3DCanvas';
import { TextScramble }  from './components/TextScramble';
import { SSLogo }        from './components/SSLogo';
import { audioFX }     from './utils/audioFX';

import { ArchitectureVisualizer }  from './components/apps/ArchitectureVisualizer';
import { FileExplorerVault }       from './components/apps/FileExplorerVault';
import { SmartAccountsAuth }       from './components/apps/SmartAccountsAuth';
import { ContractStudioExplorer }  from './components/apps/ContractStudioExplorer';
import { ProjectMilestoneManager } from './components/apps/ProjectMilestoneManager';
import { SecuritySCSVSAudit }      from './components/apps/SecuritySCSVSAudit';
import { PortfolioApp }            from './components/apps/PortfolioApp';

import { UserAccount, SystemMetrics } from './types';

/* ──────────────────────────────────────────────────────────────
   DEVICE HOOK
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
   STATIC DATA
   ────────────────────────────────────────────────────────── */
const INITIAL_USER: UserAccount = {
  address:         '0xShashankSmartAccount_ERC4337_Besu',
  smartAccountId:  'sa-shashank-mca3',
  role:            'Enterprise Admin',
  sessionKey:      'sk_0x8f2c91a3b4e5d6f7890123456789abcd',
  paymasterBalance:'2.5 ETH ($8,250)',
  passkeyEnabled:  true,
  avatar:          'SS',
  name:            'Shashank Sharma',
};

const INITIAL_METRICS: SystemMetrics = {
  qbftTps:    580,
  activeNodes: 4,
  totalBlocks: 10002,
  shardedDbStatus: {
    shardAlpha: { status: 'ONLINE', records: 1240, diskUsageMb: 142 },
    shardBeta:  { status: 'ONLINE', records:  980, diskUsageMb: 110 },
    shardGamma: { status: 'ONLINE', records: 1510, diskUsageMb: 185 },
  },
  paymasterGasBalance: 2.5,
  activeSessionKeys:   3,
};

/* ──────────────────────────────────────────────────────────────
   LOCK SCREEN
   ────────────────────────────────────────────────────────── */
interface LockScreenProps {
  user: UserAccount;
  onSignIn: () => Promise<void>;
  isLoading: boolean;
  stepMsg: string | null;
}

const LockScreen: React.FC<LockScreenProps> = ({ user, onSignIn, isLoading, stepMsg }) => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(4,13,20,0.97)',
      backdropFilter: 'blur(40px)',
      /* Safe-area padding for notch devices */
      paddingTop:    'env(safe-area-inset-top,    0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft:   'env(safe-area-inset-left,   0px)',
      paddingRight:  'env(safe-area-inset-right,  0px)',
    }}
  >
    {/* card */}
    <div
      className="ice-card"
      style={{
        width: '100%',
        maxWidth: 440,
        padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 36px)',
        margin: '0 16px',
        textAlign: 'center',
      }}
    >
      {/* SS Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 84, height: 84,
            borderRadius: 22,
            background: 'linear-gradient(135deg, rgba(74,154,181,0.25), rgba(30,122,154,0.15))',
            border: '1px solid rgba(74,154,181,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(74,154,181,0.3)',
          }}
        >
          <SSLogo size={54} variant="ice" />
        </div>
      </div>

      {/* Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <span className="ice-badge">
          <Shield className="w-3 h-3" />
          ERC-4337 Smart Account Passkey
        </span>
      </div>

      {/* Heading */}
      <h1
        className="font-mono font-black mb-2"
        style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', color: '#e8f4f8', letterSpacing: '-0.01em' }}
      >
        <TextScramble text="dOS UNIVERSE" delay={200} speed={22} />
      </h1>
      <p style={{ fontSize: '12px', color: 'rgba(184,217,232,0.5)', marginBottom: 28 }}>
        Authenticate with WebAuthn passkey to enter the decentralised workspace.
      </p>

      {/* Account info */}
      <div
        className="font-mono"
        style={{
          background: 'rgba(4,13,20,0.7)',
          border: '1px solid rgba(74,154,181,0.12)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 20,
          textAlign: 'left',
          fontSize: 11,
        }}
      >
        {[
          { k: 'Account',   v: user.name,              c: '#e8f4f8' },
          { k: 'Role',      v: user.role,              c: '#b8d9e8' },
          { k: 'Smart Acc', v: `${user.address.slice(0, 22)}…`, c: '#4a9ab5' },
          { k: 'Paymaster', v: user.paymasterBalance,  c: '#6ee7b7' },
        ].map(r => (
          <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ color: 'rgba(184,217,232,0.4)' }}>{r.k}</span>
            <span style={{ color: r.c, fontWeight: 600 }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Step message */}
      {stepMsg && (
        <div
          style={{
            background: 'rgba(74,154,181,0.08)',
            border: '1px solid rgba(74,154,181,0.25)',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 16,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: '#7ab8d0',
            textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <div className="ice-spinner" style={{ flexShrink: 0 }} />
          {stepMsg}
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={onSignIn}
        disabled={isLoading}
        className="btn-ice-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Fingerprint className="w-5 h-5" />
        {isLoading ? 'Authenticating Passkey…' : 'Sign in with Hardware Passkey'}
      </button>
    </div>
  </div>
);

/* ──────────────────────────────────────────────────────────────
   ROOT APP
   ────────────────────────────────────────────────────────── */
export default function App() {
  const [user]    = useState<UserAccount>(INITIAL_USER);
  const [metrics] = useState<SystemMetrics>(INITIAL_METRICS);

  const [isAuth,     setIsAuth]     = useState(true);
  const [isLoading,  setIsLoading]  = useState(false);
  const [stepMsg,    setStepMsg]    = useState<string | null>(null);

  const [openApps,    setOpenApps]    = useState<string[]>([]);
  const [focusedApp,  setFocusedApp]  = useState<string | null>(null);

  const device    = useDeviceCategory();
  const isMobile  = device === 'mobile';

  /* Passkey sign-in simulation */
  const handleSignIn = async () => {
    audioFX.click();
    setIsLoading(true);
    const steps = [
      'Step 1/3 · WebAuthn hardware passkey challenge…',
      'Step 2/3 · ERC-4337 UserOp signature verification…',
      'Step 3/3 · Paymaster gas sponsorship request…',
    ];
    for (const s of steps) {
      setStepMsg(s);
      await new Promise(r => setTimeout(r, 480));
    }
    audioFX.warp();
    setIsAuth(true);
    setIsLoading(false);
    setStepMsg(null);
  };

  const handleOpenApp = (id: string) => {
    if (isMobile) {
      /* On mobile: only one app open at a time — switch */
      setOpenApps([id]);
    } else {
      if (!openApps.includes(id)) setOpenApps(p => [...p, id]);
    }
    setFocusedApp(id);
  };

  const handleCloseApp = (id: string) => {
    const next = openApps.filter(x => x !== id);
    setOpenApps(next);
    if (focusedApp === id) setFocusedApp(next.at(-1) ?? null);
  };

  /* Responsive default positions / sizes
     - mobile:  position doesn't matter (full-screen via CSS)
     - tablet:  constrained to viewport
     - desktop: original values                              */
  const getSize = (w: number, h: number) => {
    if (device === 'desktop') return { width: w, height: h };
    if (device === 'tablet')  return {
      width:  Math.min(w, window.innerWidth  - 24),
      height: Math.min(h, window.innerHeight - 140),
    };
    return { width: window.innerWidth, height: window.innerHeight };
  };

  /* App definitions */
  const appDefs = [
    {
      id:   'architecture',
      name: 'Phase 1 Blueprint',
      desc: 'Architecture topology & MCA subject mapping',
      icon: <Layers className="w-4 h-4" />,
      pos:  { x: 60,  y: 70  },
      size: getSize(1000, 640),
      cmp:  <ArchitectureVisualizer />,
    },
    {
      id:   'files',
      name: 'RSA-AES File Vault',
      desc: 'Hybrid encryption & SHA-256 hash registry',
      icon: <Lock className="w-4 h-4" />,
      pos:  { x: 100, y: 90  },
      size: getSize(960, 620),
      cmp:  <FileExplorerVault />,
    },
    {
      id:   'auth',
      name: 'Smart Accounts (ERC-4337)',
      desc: 'Passkeys, session keys & Paymaster',
      icon: <Key className="w-4 h-4" />,
      pos:  { x: 140, y: 80  },
      size: getSize(900, 580),
      cmp:  <SmartAccountsAuth user={user} />,
    },
    {
      id:   'contracts',
      name: 'Solidity Studio & Besu',
      desc: 'Contract IDE, ABI inspector & Foundry',
      icon: <Terminal className="w-4 h-4" />,
      pos:  { x: 180, y: 85  },
      size: getSize(980, 630),
      cmp:  <ContractStudioExplorer />,
    },
    {
      id:   'milestones',
      name: 'Project Milestones',
      desc: 'Milestone tracking & escrow release',
      icon: <Award className="w-4 h-4" />,
      pos:  { x: 120, y: 100 },
      size: getSize(920, 600),
      cmp:  <ProjectMilestoneManager />,
    },
    {
      id:   'security',
      name: 'SCSVS Audit & Sharding',
      desc: 'Security scanner & DB topology',
      icon: <ShieldCheck className="w-4 h-4" />,
      pos:  { x: 160, y: 95  },
      size: getSize(940, 610),
      cmp:  <SecuritySCSVSAudit />,
    },
    {
      id:   'portfolio',
      name: 'Portfolio — Shashank Sharma',
      desc: 'Personal portfolio · Web3 Developer',
      icon: <User className="w-4 h-4" />,
      pos:  { x: 80, y: 80  },
      size: getSize(980, 650),
      cmp:  <PortfolioApp />,
    },
  ];

  const navApps = appDefs.map(a => ({ id: a.id, name: a.name, description: a.desc, icon: a.icon }));

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--deep)',
        position: 'relative',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ── 3D WebGL Ice Crystal Background ─────────────── */}
      <Igloo3DCanvas mouseParallax />

      {/* ── Lock Screen ─────────────────────────────────── */}
      {!isAuth && (
        <LockScreen
          user={user}
          onSignIn={handleSignIn}
          isLoading={isLoading}
          stepMsg={stepMsg}
        />
      )}

      {/* ── Navbar ──────────────────────────────────────── */}
      <OSNavbar
        user={user}
        metrics={metrics}
        onOpenApp={handleOpenApp}
        activeAppCount={openApps.length}
        onLockSession={() => setIsAuth(false)}
      />

      {/* ── Desktop / Hero ──────────────────────────────── */}
      {/* Hide desktop when any app is open on mobile */}
      {(!isMobile || openApps.length === 0) && (
        <OSDesktop
          apps={navApps}
          metrics={metrics}
          onOpenApp={handleOpenApp}
        />
      )}

      {/* ── Floating Windows ────────────────────────────── */}
      {appDefs.map(app => (
        <WindowFrame
          key={app.id}
          id={app.id}
          title={`${app.name} · dOS`}
          icon={app.icon}
          isOpen={openApps.includes(app.id)}
          isFocused={focusedApp === app.id}
          onClose={() => handleCloseApp(app.id)}
          onFocus={() => setFocusedApp(app.id)}
          defaultPosition={app.pos}
          defaultSize={app.size}
        >
          {app.cmp}
        </WindowFrame>
      ))}

      {/* ── Taskbar ─────────────────────────────────────── */}
      <OSTaskbar
        apps={navApps}
        activeApps={openApps}
        focusedAppId={focusedApp}
        onOpenApp={handleOpenApp}
        onToggleFocus={(id: string) => setFocusedApp(id)}
      />
    </div>
  );
}
