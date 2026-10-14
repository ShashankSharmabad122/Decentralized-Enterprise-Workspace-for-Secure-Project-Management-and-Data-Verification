import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Github, Linkedin, Mail, ArrowUpRight, ArrowDown, X } from 'lucide-react';
import { SSLogo } from '../SSLogo';
import { audioFX } from '../../utils/audioFX';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VANTA: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    THREE: any;
  }
}

/* ═══════════════════════════════════════════════════════════════
   ACCENT — ibi.cash acid green
═══════════════════════════════════════════════════════════════ */
const ACCENT = '#ACFF46';
const ACCENT_GLOW = 'rgba(172,255,70,0.35)';
const ACCENT_DIM = 'rgba(172,255,70,0.6)';

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const PROFILE = {
  firstName: 'SHASHANK',
  lastName: 'SHARMA',
  title: 'Web3 Engineer',
  subtitle: 'Blockchain Developer · MCA 2026',
  bio: 'Building the future of decentralised infrastructure — combining blockchain architecture, cryptographic security protocols, and immersive web experiences. Specialising in ERC-4337 Account Abstraction, Hyperledger Besu QBFT, and zero-trust enterprise systems.',
  bio2: 'Currently pursuing MCA (Sem 3) with thesis-level focus on smart contract security auditing, RSA-AES hybrid cryptography, and Web3 SDLC methodologies.',
  github: 'https://github.com/ShashankSharmabad122',
  linkedin: 'https://www.linkedin.com/in/shashank-sharma-26a0a6256/',
  email: 'shashanksharmabad122@gmail.com',
};

const PROJECTS = [
  {
    num: '001', title: 'dOS — Decentralised\nEnterprise OS', shortTitle: 'dOS Enterprise Workspace',
    year: '2026', tags: ['Hyperledger Besu', 'ERC-4337', 'RSA-AES', 'WebGL', 'Solidity'],
    desc: 'A Zero-Trust blockchain-powered web operating system featuring RSA-AES hybrid cryptography, ERC-4337 Smart Account abstraction, WebGL 3D ice-physics interface, and Hyperledger Besu QBFT consensus with MySQL sharding.',
    link: 'https://github.com/ShashankSharmabad122/IOS_SHASHANK-update', type: 'MAJOR PROJECT',
    architecture: 'Tier 1: React/TS UI Layer ➔ Tier 2: Go/Express Middleware ➔ Tier 3: Hyperledger Besu QBFT ➔ Tier 4: MySQL Sharded Vault',
    highlights: [
      'RSA-2048 key wrapping & AES-256-GCM client payload encryption',
      'ERC-4337 WebAuthn Passkey session key issuance with Paymaster gas sponsorship',
      'SCSVS security compliance audit scanner (Foundry fuzz-tested)',
      'Hyperledger Besu QBFT private EVM consensus topology',
    ],
  },
  {
    num: '002', title: 'Zero-Trust RBAC\nSmart Contracts', shortTitle: 'RBAC Smart Contract Suite',
    year: '2026', tags: ['Solidity', 'Foundry', 'RBAC', 'SHA-256', 'Besu'],
    desc: 'On-chain Role-Based Access Control suite: UserRoleAccess.sol, FileHashRegistry.sol (SHA-256 immutable storage), and ProjectMilestones.sol with multi-sig verifier escrow. 100% Foundry fuzz-tested.',
    link: 'https://github.com/ShashankSharmabad122', type: 'SMART CONTRACTS',
    architecture: 'Solidity 0.8.24 ➔ OpenZeppelin AccessControl ➔ Foundry Fuzz Engine ➔ Besu Network Deployment',
    highlights: [
      'Role-based permissions (Admin, Developer, Auditor, User)',
      'Multi-sig milestone verifier escrow release mechanism',
      'Immutable SHA-256 payload registering on-chain',
      'ReentrancyGuard & CEI security compliance',
    ],
  },
  {
    num: '003', title: 'RSA-AES\nCryptographic Vault', shortTitle: 'RSA-AES Cryptographic Vault',
    year: '2025', tags: ['RSA-2048', 'AES-256-GCM', 'SHA-256', 'React', 'MySQL'],
    desc: 'Hybrid RSA-2048 / AES-256-GCM encryption pipeline with client-side key generation, SHA-256 fingerprinting, drag & drop upload, and sharded MySQL tamper detection linked to Hyperledger Besu.',
    link: 'https://github.com/ShashankSharmabad122', type: 'CRYPTOGRAPHY',
    architecture: 'Client KeyWrap (RSA-2048) ➔ AES-256 Cipher Stream ➔ SHA-256 Hash Verification ➔ Multi-Node MySQL Sharding',
    highlights: [
      'Client-side zero-knowledge key generation',
      'Automated horizontal shard router based on SHA-256 prefix',
      'Tamper-detection audit against Besu ledger hash',
      'Tessera private transaction support',
    ],
  },
  {
    num: '004', title: 'iOS-Inspired\nBrowser OS', shortTitle: 'iOS Browser OS',
    year: '2025', tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Web OS'],
    desc: 'A browser-based operating system with iOS-style windowed UI, floating dock, portfolio management, and full app lifecycle management running entirely in the browser with zero backend.',
    link: 'https://shashanksharmabad122.github.io/IOS_SHASHANK-update/portfolio-app.html', type: 'WEB DEVELOPMENT',
    architecture: 'React Custom Window Manager ➔ Web Audio Synthesis ➔ LocalStorage Virtual File System',
    highlights: [
      'Draggable, resizable, stackable window manager',
      'Web Audio sound engine for interactive feedback',
      'Custom app ecosystem & settings management',
    ],
  },
];

const SKILLS_MARQUEE = [
  'Hyperledger Besu', 'ERC-4337', 'Solidity', 'TypeScript',
  'RSA-2048', 'AES-256-GCM', 'WebAuthn', 'QBFT Consensus',
  'React', 'Three.js', 'WebGL', 'Node.js', 'Go', 'Python',
  'Foundry', 'Hardhat', 'MySQL', 'SHA-256', 'Zero-Trust',
];

const TIMELINE = [
  { year: '2026', role: 'MCA Thesis Project', co: 'dOS — Decentralised Enterprise OS', desc: 'Built a full-stack zero-trust blockchain workspace as thesis-level project integrating 6+ semester subjects.' },
  { year: '2025', role: 'Smart Contract Developer', co: 'Personal Research', desc: 'Designed and deployed RBAC smart contracts on Hyperledger Besu private network with Tessera privacy.' },
  { year: '2024', role: 'Full-Stack Web Developer', co: 'Independent Projects', desc: 'Built iOS-inspired browser OS and various React/Node.js applications with Web Audio API integration.' },
  { year: '2021', role: 'BCA Undergraduate', co: 'Computer Science', desc: 'Foundation in algorithms, networking, databases, and object-oriented programming.' },
];

/* ═══════════════════════════════════════════════════════════════
   CHAPTERS — scroll-spy config
═══════════════════════════════════════════════════════════════ */
const CHAPTERS = [
  { id: 'hero', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

/* ═══════════════════════════════════════════════════════════════
   VANTA HERO — Vanta FOG effect (acid-green wisps on black)
═══════════════════════════════════════════════════════════════ */
const VantaHero: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    const initVanta = () => {
      if (!vantaRef.current || !window.VANTA) return;
      if (vantaEffect.current) vantaEffect.current.destroy();
      vantaEffect.current = window.VANTA.FOG({
        el: vantaRef.current,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        // Acid-green fog on pitch-black
        highlightColor: 0xACFF46,   // bright acid green wisps
        midtoneColor: 0x2a5c00,   // deep forest green mid-layer
        lowlightColor: 0x060d00,   // near-black dark green
        baseColor: 0x000000,   // pure black base
        blurFactor: 0.60,
        speed: 1.20,
        zoom: 0.80,
      });
    };

    const loadVanta = () => {
      if (window.VANTA?.FOG) { initVanta(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
      s.onload = initVanta;
      document.head.appendChild(s);
    };

    if (window.THREE) {
      loadVanta();
    } else {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js';
      s.onload = loadVanta;
      document.head.appendChild(s);
    }

    return () => {
      if (vantaEffect.current) { vantaEffect.current.destroy(); vantaEffect.current = null; }
    };
  }, []);

  return <div ref={vantaRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
};


/* ═══════════════════════════════════════════════════════════════
   RADIAL MENU & GSAP PROGRESS NAVIGATOR
   ─ Radial circular fan-out menu with GSAP spring physics
   ─ Illuminated active slider block matching GSAP UI design
═══════════════════════════════════════════════════════════════ */
interface RadialMenuItem {
  id: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  action: () => void;
}

const GSAPRadialMenu: React.FC<{
  activeSection: string;
  onScrollTo: (id: string) => void;
}> = ({ activeSection, onScrollTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);

  const menuItems: RadialMenuItem[] = [
    { id: 'hero', label: 'Intro', sub: '01', icon: <span style={{ fontSize: 13, fontWeight: 900 }}>◆</span>, action: () => onScrollTo('hero') },
    { id: 'about', label: 'About', sub: '02', icon: <span style={{ fontSize: 11, fontWeight: 800 }}>ME</span>, action: () => onScrollTo('about') },
    { id: 'work', label: 'Work', sub: '03', icon: <span style={{ fontSize: 11, fontWeight: 800 }}>001</span>, action: () => onScrollTo('work') },
    { id: 'skills', label: 'Skills', sub: '04', icon: <span style={{ fontSize: 13, fontWeight: 800 }}>⚡</span>, action: () => onScrollTo('skills') },
    { id: 'contact', label: 'Contact', sub: '05', icon: <Mail style={{ width: 13, height: 13 }} />, action: () => onScrollTo('contact') },
  ];

  /* GSAP Radial Fan-out Animation */
  useEffect(() => {
    const items = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
    if (!items.length) return;

    if (isOpen) {
      audioFX.warp();
      const radius = 108; // px radius
      const startAngle = Math.PI * 0.55;  // bottom-left
      const endAngle = Math.PI * 1.45;  // top-left

      gsap.to(triggerRef.current, {
        rotate: 135,
        scale: 1.12,
        boxShadow: `0 0 28px ${ACCENT}, 0 0 50px rgba(172,255,70,0.45)`,
        duration: 0.35,
        ease: 'back.out(2)',
      });

      if (ringRef.current) {
        gsap.fromTo(ringRef.current,
          { scale: 0.4, opacity: 0, rotate: -60 },
          { scale: 1, opacity: 1, rotate: 0, duration: 0.5, ease: 'expo.out' }
        );
      }

      items.forEach((btn, index) => {
        const step = (endAngle - startAngle) / (items.length - 1);
        const angle = startAngle + step * index;
        const targetX = Math.cos(angle) * radius;
        const targetY = Math.sin(angle) * radius;

        gsap.fromTo(btn,
          { x: 0, y: 0, scale: 0, opacity: 0, rotate: -45 },
          {
            x: targetX,
            y: targetY,
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 0.45,
            delay: index * 0.045,
            ease: 'back.out(2.4)',
            overwrite: 'auto',
          }
        );
      });
    } else {
      gsap.to(triggerRef.current, {
        rotate: 0,
        scale: 1,
        boxShadow: `0 0 16px ${ACCENT_GLOW}`,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      if (ringRef.current) {
        gsap.to(ringRef.current, { scale: 0.6, opacity: 0, duration: 0.25 });
      }

      items.forEach((btn, index) => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          rotate: 30,
          duration: 0.25,
          delay: (items.length - 1 - index) * 0.025,
          ease: 'power3.in',
          overwrite: 'auto',
        });
      });
    }
  }, [isOpen]);

  const toggleMenu = () => {
    audioFX.click();
    setIsOpen(prev => !prev);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: 32,
        right: 28,
        zIndex: 250,
        pointerEvents: 'auto',
      }}
    >
      {/* Decorative Radial Arc Ring */}
      <svg
        ref={ringRef}
        width="260"
        height="260"
        style={{
          position: 'absolute',
          right: -106,
          bottom: -106,
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 1,
        }}
      >
        <circle
          cx="130"
          cy="130"
          r="108"
          fill="none"
          stroke="rgba(172,255,70,0.18)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle
          cx="130"
          cy="130"
          r="114"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </svg>

      {/* Radial Menu Items */}
      {menuItems.map((item, i) => {
        const isActive = activeSection === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <button
            key={item.id}
            ref={el => { itemsRef.current[i] = el; }}
            onClick={() => {
              item.action();
              setIsOpen(false);
            }}
            onMouseEnter={() => {
              setHoveredItem(item.id);
              if (itemsRef.current[i]) {
                gsap.to(itemsRef.current[i], { scale: 1.22, duration: 0.2, ease: 'back.out(2)' });
              }
            }}
            onMouseLeave={() => {
              setHoveredItem(null);
              if (itemsRef.current[i]) {
                gsap.to(itemsRef.current[i], { scale: 1, duration: 0.2, ease: 'power2.out' });
              }
            }}
            title={item.label}
            style={{
              position: 'absolute',
              right: 4,
              bottom: 4,
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: isActive
                ? ACCENT
                : isHovered
                  ? 'rgba(172,255,70,0.22)'
                  : 'rgba(10,20,12,0.92)',
              border: isActive
                ? `1.5px solid ${ACCENT}`
                : `1px solid ${isHovered ? ACCENT : 'rgba(172,255,70,0.25)'}`,
              color: isActive ? '#000' : (isHovered ? ACCENT : 'rgba(255,255,255,0.8)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: isActive
                ? `0 0 16px ${ACCENT}, 0 0 28px rgba(172,255,70,0.4)`
                : isHovered
                  ? `0 0 12px ${ACCENT_GLOW}`
                  : '0 4px 12px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              pointerEvents: isOpen ? 'auto' : 'none',
              transform: 'scale(0)',
              outline: 'none',
            }}
          >
            {item.icon}

            {/* Radial Item Tooltip */}
            {isHovered && (
              <span
                style={{
                  position: 'absolute',
                  right: 44,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'rgba(5,12,6,0.95)',
                  border: `1px solid ${ACCENT_DIM}`,
                  color: ACCENT,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  boxShadow: `0 0 10px rgba(0,0,0,0.8), 0 0 12px ${ACCENT_GLOW}`,
                  pointerEvents: 'none',
                  animation: 'chapter-label-in 0.18s ease-out forwards',
                }}
              >
                {item.sub} · {item.label}
              </span>
            )}
          </button>
        );
      })}

      {/* Main Trigger Center Button */}
      <button
        ref={triggerRef}
        onClick={toggleMenu}
        title={isOpen ? 'Close Radial Menu' : 'Open Radial Menu'}
        style={{
          width: 46,
          height: 46,
          borderRadius: '50%',
          background: isOpen
            ? ACCENT
            : 'linear-gradient(135deg, rgba(20,38,15,0.95) 0%, rgba(4,10,4,0.98) 100%)',
          border: `1.5px solid ${isOpen ? ACCENT : ACCENT_DIM}`,
          color: isOpen ? '#000' : ACCENT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 0 18px ${ACCENT_GLOW}, 0 4px 16px rgba(0,0,0,0.7)`,
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 20,
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 900, lineHeight: 1, display: 'inline-block' }}>
          {isOpen ? '✕' : '❖'}
        </span>
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SCROLL SPY SIDEBAR — illuminated acid-green rectangular slider
   ─ Displays glowing uppercase title (INTRO, ABOUT, WORK...)
   ─ Sliding neon green handle block + floating tooltip
═══════════════════════════════════════════════════════════════ */
const ScrollSpySidebar: React.FC<{
  activeSection: string;
  onScrollTo: (id: string) => void;
}> = ({ activeSection, onScrollTo }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const activeIndex = Math.max(0, CHAPTERS.findIndex(ch => ch.id === activeSection));
  const activeChapter = CHAPTERS[activeIndex] || CHAPTERS[0];

  const SEGMENT_H = 42; // px per chapter step
  const TRACK_H = (CHAPTERS.length - 1) * SEGMENT_H;
  const thumbY = activeIndex * SEGMENT_H;

  return (
    <>
      <div style={{
        position: 'absolute',
        right: 14,
        top: 0,
        bottom: 0,
        width: 140,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          pointerEvents: 'auto',
          height: TRACK_H + 28,
        }}>
          {/* Active Title Callout on Left (e.g. INTRO) */}
          <div
            style={{
              position: 'absolute',
              right: 28,
              top: thumbY + 14,
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: ACCENT,
              textShadow: `0 0 12px ${ACCENT}, 0 0 24px rgba(172,255,70,0.55)`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              transition: 'top 0.45s cubic-bezier(0.16,1,0.3,1)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {activeChapter.label}
          </div>

          {/* Vertical Track Rail */}
          <div style={{
            position: 'absolute',
            right: 4,
            top: 14,
            width: 2,
            height: TRACK_H,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 1,
          }}>
            {/* Filled progress section */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${(activeIndex / (CHAPTERS.length - 1)) * 100}%`,
              background: `linear-gradient(to bottom, ${ACCENT}, rgba(172,255,70,0.4))`,
              boxShadow: `0 0 6px ${ACCENT_GLOW}`,
              transition: 'height 0.45s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>

          {/* Illuminated Glowing Rectangular Block Handle (as in screenshot) */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: thumbY + 14,
              transform: 'translateY(-50%)',
              width: 10,
              height: 22,
              borderRadius: 3,
              background: ACCENT,
              boxShadow: `0 0 14px ${ACCENT}, 0 0 28px rgba(172,255,70,0.7), inset 0 0 4px #FFF`,
              pointerEvents: 'none',
              transition: 'top 0.45s cubic-bezier(0.16,1,0.3,1)',
              zIndex: 3,
            }}
          />

          {/* Interactive Chapter Click Nodes */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: TRACK_H,
            position: 'relative',
            zIndex: 4,
          }}>
            {CHAPTERS.map((ch) => {
              const isHov = hovered === ch.id;

              return (
                <div
                  key={ch.id}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: 24,
                  }}
                >
                  {/* Tooltip Box on hover (like screenshot: dark box with outline) */}
                  {isHov && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 22,
                        padding: '4px 9px',
                        background: 'rgba(20,20,20,0.96)',
                        border: '1px solid rgba(255,255,255,0.7)',
                        borderRadius: 3,
                        color: '#FFF',
                        fontSize: 11,
                        fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.85)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {ch.label}
                    </div>
                  )}

                  {/* Click Target Button */}
                  <button
                    onClick={() => onScrollTo(ch.id)}
                    onMouseEnter={() => setHovered(ch.id)}
                    onMouseLeave={() => setHovered(null)}
                    title={ch.label}
                    style={{
                      width: 24,
                      height: 24,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: isHov ? '#FFF' : 'rgba(255,255,255,0.2)',
                        transition: 'all 0.2s',
                        boxShadow: isHov ? '0 0 8px #FFF' : 'none',
                      }}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating GSAP Radial Menu */}
      <GSAPRadialMenu activeSection={activeSection} onScrollTo={onScrollTo} />
    </>
  );
};


/* ═══════════════════════════════════════════════════════════════
   MARQUEE
═══════════════════════════════════════════════════════════════ */
const Marquee: React.FC<{ items: string[]; speed?: number; reverse?: boolean; light?: boolean }> = ({ items, speed = 35, reverse, light }) => {
  const doubled = [...items, ...items];
  const color = light ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)';
  const sepColor = light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)';
  return (
    <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
      <div style={{
        display: 'flex',
        gap: 0,
        animation: `marquee-scroll ${speed}s linear infinite ${reverse ? 'reverse' : ''}`,
        whiteSpace: 'nowrap',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color, padding: '0 28px' }}>
              {item}
            </span>
            <span style={{ color: sepColor, fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN PORTFOLIO COMPONENT
═══════════════════════════════════════════════════════════════ */
export const PortfolioApp: React.FC = () => {
  /* refs */
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorBlobRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /* state */
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredProj, setHoveredProj] = useState<number | null>(null);
  const [selectedProj, setSelectedProj] = useState<typeof PROJECTS[0] | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  /* ─── Keyframes injection ───────────────────────────────── */
  useEffect(() => {
    const id = 'yuga-portfolio-v2';
    if (document.getElementById(id)) return;
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes marquee-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      @keyframes cursor-ping    { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(1.8);opacity:0} }
      @keyframes line-draw      { from{transform:scaleY(0)} to{transform:scaleY(1)} }
      @keyframes hero-grain     {
        0%,100%{transform:translate(0,0)} 20%{transform:translate(-1px,1px)}
        40%{transform:translate(1px,-1px)} 60%{transform:translate(-1px,-1px)} 80%{transform:translate(1px,1px)}
      }
      @keyframes dot-pulse {
        0%,100%{ box-shadow: 0 0 6px ${ACCENT}, 0 0 14px rgba(172,255,70,0.28); }
        50%    { box-shadow: 0 0 10px ${ACCENT}, 0 0 22px rgba(172,255,70,0.48); }
      }
      @keyframes chapter-label-in {
        from { opacity:0; transform:translate(6px,-50%); }
        to   { opacity:1; transform:translate(0,-50%); }
      }
      @keyframes fog-glow {
        0%,100%{ opacity:0.32; } 50%{ opacity:0.55; }
      }
      .gsap-cursor-blob {
        position:fixed; width:72px; height:72px; border-radius:50%;
        background:${ACCENT}; pointer-events:none; z-index:9999;
        mix-blend-mode:difference; display:flex; align-items:center; justify-content:center;
        will-change:transform;
      }
      .gsap-cursor-ring {
        position:fixed; width:72px; height:72px; border-radius:50%;
        border:1px solid ${ACCENT_DIM}; pointer-events:none; z-index:9998;
        animation:cursor-ping 1.2s cubic-bezier(0,0,0.2,1) infinite; will-change:transform;
      }
      .hero-char              { display:inline-block; will-change:transform,opacity; }
      .portfolio-proj-row     { will-change:transform,opacity; }
      .portfolio-skill-item   { will-change:transform,opacity; }
      .portfolio-timeline-item{ will-change:transform,opacity; }
      .portfolio-stat-item    { will-change:transform,opacity; }
      .gsap-fade-up           { will-change:transform,opacity; }
    `;
    document.head.appendChild(s);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ─── Lenis smooth scroll ───────────────────────────────── */
  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
    });

    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      /* progress bar */
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min((scroll / limit) * 100, 100)}%`;
      }
      /* section spy */
      const cont = containerRef.current;
      if (!cont) return;
      for (const ch of CHAPTERS) {
        const sec = cont.querySelector(`#yp-${ch.id}`) as HTMLElement | null;
        if (!sec) continue;
        const top = sec.getBoundingClientRect().top - cont.getBoundingClientRect().top;
        if (top <= cont.clientHeight * 0.52) setActiveSection(ch.id);
      }
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((t) => lenis.raf(t * 1000));
    };
  }, []);

  /* ─── GSAP ScrollTrigger animations ────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cont = containerRef.current;
      if (!cont) return;
      ScrollTrigger.defaults({ scroller: cont });

      /* Hero name — 3D char reveal */
      if (heroNameRef.current) {
        gsap.fromTo(
          heroNameRef.current.querySelectorAll('.hero-char'),
          { y: 120, opacity: 0, rotateX: -45, transformOrigin: '50% 100%' },
          { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: 'expo.out', stagger: 0.045, delay: 0.25 }
        );
      }
      if (heroSubRef.current) {
        gsap.fromTo(heroSubRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', delay: 0.85 }
        );
      }

      /* Stats */
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.querySelectorAll('.portfolio-stat-item'),
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
          }
        );
        statsRef.current.querySelectorAll('.stat-number').forEach((el) => {
          const target = parseInt((el as HTMLElement).dataset.target || '0', 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 1.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: () => { (el as HTMLElement).textContent = Math.round(obj.val).toLocaleString(); },
          });
        });
      }

      /* About */
      if (aboutRef.current) {
        gsap.fromTo(
          aboutRef.current.querySelectorAll('.gsap-fade-up'),
          { y: 52, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.1,
            scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' }
          }
        );
      }

      /* Work rows */
      if (workRef.current) {
        gsap.fromTo(
          workRef.current.querySelectorAll('.portfolio-proj-row'),
          { x: -70, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: workRef.current, start: 'top 75%' }
          }
        );
      }

      /* Skills + Timeline */
      if (skillsRef.current) {
        gsap.fromTo(
          skillsRef.current.querySelectorAll('.portfolio-skill-item'),
          { y: 36, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.5)', stagger: 0.055,
            scrollTrigger: { trigger: skillsRef.current, start: 'top 70%' }
          }
        );
        gsap.fromTo(
          skillsRef.current.querySelectorAll('.portfolio-timeline-item'),
          { x: -44, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.12,
            scrollTrigger: { trigger: skillsRef.current, start: 'top 60%' }
          }
        );
      }

      /* Contact */
      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current.querySelectorAll('.gsap-fade-up'),
          { y: 64, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.13,
            scrollTrigger: { trigger: contactRef.current, start: 'top 80%' }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* ─── GSAP quickTo magnetic cursor ─────────────────────── */
  const xTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const yTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  useEffect(() => {
    if (!cursorBlobRef.current) return;
    xTo.current = gsap.quickTo(cursorBlobRef.current, 'left', { duration: 0.42, ease: 'power3' });
    yTo.current = gsap.quickTo(cursorBlobRef.current, 'top', { duration: 0.42, ease: 'power3' });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY });
    xTo.current?.(e.clientX - 36);
    yTo.current?.(e.clientY - 36);
  }, []);

  const scrollTo = (id: string) => {
    audioFX.click();
    const el = containerRef.current?.querySelector(`#yp-${id}`) as HTMLElement | null;
    if (el && containerRef.current) {
      containerRef.current.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  /* ─── Render hero name split into chars ─────────────────── */
  const renderHeroName = (text: string, outlined = false) => (
    <div style={{
      fontWeight: 900,
      fontSize: 'clamp(4rem,13vw,11rem)',
      letterSpacing: '-0.04em',
      lineHeight: 0.88,
      color: outlined ? 'transparent' : '#FFF',
      WebkitTextStroke: outlined ? '1.5px rgba(255,255,255,0.38)' : undefined,
      fontFamily: 'Inter,system-ui,sans-serif',
      overflow: 'hidden',
    }}>
      {text.split('').map((ch, i) => (
        <span key={i} className="hero-char" style={{ display: 'inline-block', willChange: 'transform,opacity' }}>
          {ch}
        </span>
      ))}
    </div>
  );

  const NAV = ['about', 'work', 'skills', 'contact'];

  /* ═════════════════════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════════════════════ */
  return (
    /* Outer wrapper — position relative so sidebar can be absolute */
    <div
      ref={outerRef}
      style={{ height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}
    >
      {/* ── ibi.cash-style scroll-spy sidebar ── */}
      <ScrollSpySidebar activeSection={activeSection} onScrollTo={scrollTo} />

      {/* ── Scrollable portfolio content ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#000',
          color: '#FFF',
          fontFamily: 'Inter, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Scroll progress bar — acid green */}
        <div ref={progressRef} style={{
          position: 'fixed', top: 0, left: 0, width: '0%', height: 2,
          background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_DIM})`,
          zIndex: 999, pointerEvents: 'none',
          boxShadow: `0 0 10px ${ACCENT}`,
          transition: 'width 0.04s linear',
        }} />

        {/* Magnetic cursor blob */}
        {cursorVisible && hoveredProj !== null && (
          <>
            <div ref={cursorBlobRef} className="gsap-cursor-blob" style={{ left: mouse.x - 36, top: mouse.y - 36 }}>
              <ArrowUpRight style={{ width: 18, height: 18, color: '#000' }} />
            </div>
            <div className="gsap-cursor-ring" style={{ left: mouse.x - 36, top: mouse.y - 36 }} />
          </>
        )}

        {/* ══ PROJECT MODAL ═══════════════════════════════════ */}
        {selectedProj && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
            <div style={{
              width: '100%', maxWidth: 680,
              background: '#070707',
              border: `1px solid ${ACCENT_DIM}`,
              borderRadius: 12, padding: 32, position: 'relative',
              boxShadow: `0 24px 80px rgba(0,0,0,0.9), 0 0 40px ${ACCENT_GLOW}`,
            }}>
              <button
                onClick={() => setSelectedProj(null)}
                style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: ACCENT_DIM, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>
                {selectedProj.type} · {selectedProj.year}
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: '#FFF', margin: '0 0 14px', whiteSpace: 'pre-line' }}>
                {selectedProj.title}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, marginBottom: 20 }}>
                {selectedProj.desc}
              </p>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Architecture & Data Flow</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#FFF', background: 'rgba(172,255,70,0.04)', border: `1px solid ${ACCENT_GLOW}`, padding: '10px 14px', borderRadius: 6, lineHeight: 1.6 }}>
                  {selectedProj.architecture}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>Key Technical Highlights</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.85 }}>
                  {selectedProj.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
              <div style={{ display: 'flex', gap: 12, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                <a href={selectedProj.link} target="_blank" rel="noreferrer"
                  onClick={() => audioFX.warp()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 999, background: ACCENT, color: '#000', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
                >
                  Launch Repository <ArrowUpRight style={{ width: 14, height: 14 }} />
                </a>
                <button onClick={() => setSelectedProj(null)}
                  style={{ padding: '10px 20px', borderRadius: 999, background: 'transparent', border: `1px solid rgba(172,255,70,0.25)`, color: ACCENT_DIM, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                >
                  Close Spec
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ STICKY NAV ══════════════════════════════════════ */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 36px', height: 52,
          background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <button onClick={() => scrollTo('hero')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <SSLogo size={26} variant="light" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800, color: '#FFF', letterSpacing: '0.22em' }}>SS</span>
          </button>

          <div style={{ display: 'flex' }}>
            {NAV.map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: activeSection === id ? ACCENT : 'rgba(255,255,255,0.3)',
                padding: '0 16px', height: 52,
                borderBottom: `2px solid ${activeSection === id ? ACCENT : 'transparent'}`,
                transition: 'all 0.3s',
              }}>
                {id}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {[
              { icon: <Github style={{ width: 15, height: 15 }} />, href: PROFILE.github },
              { icon: <Linkedin style={{ width: 15, height: 15 }} />, href: PROFILE.linkedin },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                onClick={() => audioFX.click()}
                style={{ color: 'rgba(255,255,255,0.32)', display: 'flex', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.32)')}
              >{s.icon}</a>
            ))}
          </div>
        </nav>

        {/* ══ CHAPTER 0 — HERO ════════════════════════════════ */}
        <section
          id="yp-hero"
          style={{
            minHeight: 'calc(100% - 52px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: '0 40px 56px', position: 'relative', overflow: 'hidden', background: '#000',
          }}
        >
          {/* Vanta FOG */}
          <VantaHero />

          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            backgroundImage: `linear-gradient(rgba(172,255,70,0.025) 1px, transparent 1px), linear-gradient(90deg,rgba(172,255,70,0.025) 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
          }} />

          {/* Film grain */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.022, pointerEvents: 'none', zIndex: 1, animation: 'hero-grain 0.28s steps(1) infinite' }}>
            <filter id="grain2"><feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="100%" height="100%" filter="url(#grain2)" />
          </svg>

          {/* Bottom fade to black */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 260, background: 'linear-gradient(transparent, #000 85%)', pointerEvents: 'none', zIndex: 1 }} />

          {/* Green radial glow — animated */}
          <div style={{
            position: 'absolute', top: '20%', right: '8%',
            width: 420, height: 420,
            background: `radial-gradient(circle, rgba(172,255,70,0.22) 0%, transparent 68%)`,
            borderRadius: '50%', pointerEvents: 'none', zIndex: 1, filter: 'blur(60px)',
            animation: 'fog-glow 4s ease-in-out infinite',
          }} />

          {/* Top-left corner tag */}
          <div style={{ position: 'absolute', top: 24, left: 40, zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, display: 'block', boxShadow: `0 0 6px ${ACCENT}` }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Available · India · 2026</span>
            </div>
          </div>

          {/* Top-right corner tag */}
          <div style={{ position: 'absolute', top: 24, right: 60, textAlign: 'right', zIndex: 2 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.16)', lineHeight: 2, textTransform: 'uppercase' }}>
              <div>MCA — Sem 3</div>
              <div>Blockchain · Web3</div>
            </div>
          </div>

          {/* Big watermark */}
          <div style={{
            position: 'absolute', bottom: -50, left: -10,
            fontWeight: 900, fontSize: 'clamp(9rem,28vw,26rem)',
            letterSpacing: '-0.06em', lineHeight: 1,
            color: 'transparent', WebkitTextStroke: '1px rgba(172,255,70,0.03)',
            userSelect: 'none', pointerEvents: 'none',
            fontFamily: 'Inter,system-ui,sans-serif', zIndex: 1,
          }}>SS</div>

          {/* Main hero content */}
          <div style={{ position: 'relative', zIndex: 2 }} ref={heroNameRef}>
            {/* Eye-row label */}
            <div className="hero-char" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, willChange: 'transform,opacity' }}>
              <span style={{ display: 'block', width: 24, height: 1, background: ACCENT }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.28em', textTransform: 'uppercase', color: ACCENT }}>Web3 Engineer · Blockchain Developer</span>
            </div>

            {/* SHASHANK */}
            <div style={{ overflow: 'hidden', marginBottom: 2 }}>{renderHeroName('SHASHANK')}</div>
            {/* SHARMA outlined */}
            <div style={{ overflow: 'hidden', marginBottom: 40 }}>{renderHeroName('SHARMA', true)}</div>

            {/* Bottom action bar */}
            <div ref={heroSubRef} style={{
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16,
              paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)',
              willChange: 'transform,opacity',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                Solidity · Besu · ERC-4337 · React · Three.js
              </div>
              <div style={{ flex: 1 }} />
              {/* Ghost explore link */}
              <button
                onClick={() => scrollTo('about')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  background: 'transparent', color: 'rgba(255,255,255,0.45)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999,
                  padding: '9px 20px', fontSize: 9,
                  fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { const t = e.currentTarget as HTMLElement; t.style.color = '#fff'; t.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { const t = e.currentTarget as HTMLElement; t.style.color = 'rgba(255,255,255,0.45)'; t.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                About me
              </button>
              {/* Primary CTA */}
              <button
                onClick={() => scrollTo('work')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: ACCENT, color: '#000',
                  border: 'none', borderRadius: 999,
                  padding: '10px 22px', fontSize: 9,
                  fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', transition: 'all 0.28s',
                  boxShadow: `0 0 24px rgba(172,255,70,0.32)`,
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = 'scale(1.06)';
                  t.style.boxShadow = `0 0 42px rgba(172,255,70,0.55)`;
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget as HTMLElement;
                  t.style.transform = 'scale(1)';
                  t.style.boxShadow = `0 0 24px rgba(172,255,70,0.32)`;
                }}
              >
                View Work <ArrowUpRight style={{ width: 11, height: 11 }} />
              </button>
            </div>
          </div>
        </section>

        {/* ══ MARQUEE STRIP 1 ════════════════════════════════ */}
        <div style={{ borderTop: `1px solid rgba(172,255,70,0.12)`, borderBottom: `1px solid rgba(172,255,70,0.12)`, padding: '14px 0', background: '#050505', overflow: 'hidden' }}>
          <Marquee items={SKILLS_MARQUEE} speed={40} />
        </div>

        {/* ══ STATS ══════════════════════════════════════════ */}
        <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: '#080808', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            { value: 3, suffix: '+', label: 'Years Building' },
            { value: 4, suffix: '', label: 'Smart Contracts' },
            { value: 6, suffix: '', label: 'Subjects Mapped' },
            { value: 10002, suffix: '', label: 'Blocks Mined' },
          ].map((s, i) => (
            <div key={s.label} className="portfolio-stat-item" style={{ padding: '32px 40px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
              <div style={{ fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 900, color: '#FFF', lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
                <span className="stat-number" data-target={s.value}>0</span>{s.suffix}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.26)', marginTop: 10 }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* ══ CHAPTER 1 — ABOUT (WHITE) ══════════════════════ */}
        <section ref={aboutRef} id="yp-about" style={{ background: '#FFF', color: '#000', padding: '80px 36px', minHeight: '100%' }}>
          {/* Chapter tag */}
          <div className="gsap-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <span style={{ display: 'block', width: 30, height: 1, background: 'rgba(0,0,0,0.3)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.38)' }}>Chapter 01 — About</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <h2 className="gsap-fade-up" style={{ fontWeight: 900, fontSize: 'clamp(2.2rem,5vw,4rem)', letterSpacing: '-0.04em', lineHeight: 1.02, color: '#000', marginBottom: 36 }}>
                Building the<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300 }}>decentralised</em><br />
                web — one<br />
                block at a time.
              </h2>

              <p className="gsap-fade-up" style={{ fontSize: 13.5, lineHeight: 1.9, color: 'rgba(0,0,0,0.56)', marginBottom: 18 }}>{PROFILE.bio}</p>
              <p className="gsap-fade-up" style={{ fontSize: 13.5, lineHeight: 1.9, color: 'rgba(0,0,0,0.42)' }}>{PROFILE.bio2}</p>

              <div className="gsap-fade-up" style={{ display: 'flex', gap: 10, marginTop: 36 }}>
                {[
                  { label: 'GitHub', href: PROFILE.github, icon: <Github style={{ width: 13, height: 13 }} /> },
                  { label: 'LinkedIn', href: PROFILE.linkedin, icon: <Linkedin style={{ width: 13, height: 13 }} /> },
                  { label: 'Email Me', href: `mailto:${PROFILE.email}`, icon: <Mail style={{ width: 13, height: 13 }} /> },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    onClick={() => audioFX.click()}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.14)', color: '#000', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', transition: 'all 0.25s' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#000'; el.style.color = '#FFF'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#000'; }}
                  >{s.icon}{s.label}</a>
                ))}
              </div>
            </div>

            {/* Portrait + Education */}
            <div>
              <div className="gsap-fade-up" style={{ width: '100%', aspectRatio: '4/5', maxHeight: 460, background: '#0a0a0a', borderRadius: 8, overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid rgba(0,0,0,0.07)' }}>
                <img src="/shashank-photo.jpg" alt="Shashank Sharma" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} onError={e => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
                  <div style={{ fontWeight: 900, fontSize: '6rem', color: 'rgba(255,255,255,0.05)', letterSpacing: '-0.05em', lineHeight: 1 }}>SS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)', marginTop: 8 }}>SHASHANK SHARMA</div>
                </div>
                <div style={{ position: 'absolute', bottom: 14, left: 14, fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.14)', zIndex: 2 }}>
                  Web3 Engineer · India
                </div>
              </div>

              <div className="gsap-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { deg: 'MCA', school: 'Master of Computer Applications', year: '2024–Present', focus: 'Blockchain · Web3 · Cryptography' },
                  { deg: 'BCA', school: 'Bachelor of Computer Applications', year: '2021–2024', focus: 'Computer Science · Networking' },
                ].map(edu => (
                  <div key={edu.deg} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#F8F8F8', borderRadius: 8, border: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 6, background: '#000', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{edu.deg}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 2 }}>{edu.school}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(0,0,0,0.42)', letterSpacing: '0.08em' }}>{edu.year} · {edu.focus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ MARQUEE STRIP 2 ════════════════════════════════ */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '13px 0', background: '#F5F5F5', overflow: 'hidden' }}>
          <Marquee items={['Solidity', 'Hyperledger Besu', 'QBFT', 'ERC-4337', 'WebAuthn', 'RSA-2048', 'AES-256-GCM', 'SHA-256', 'Three.js', 'WebGL', 'React', 'TypeScript', 'Go', 'Python']} speed={32} reverse light />
        </div>

        {/* ══ CHAPTER 2 — WORK (BLACK) ═══════════════════════ */}
        <section
          ref={workRef}
          id="yp-work"
          style={{ background: '#000', padding: '80px 0', minHeight: '100%' }}
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => { setCursorVisible(false); setHoveredProj(null); }}
        >
          {/* Chapter heading */}
          <div style={{ padding: '0 36px', marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ display: 'block', width: 30, height: 1, background: ACCENT_DIM }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT }}>Chapter 02 — Work</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <h2 style={{ fontWeight: 900, fontSize: 'clamp(3rem,9vw,7rem)', letterSpacing: '-0.04em', lineHeight: 0.9, color: '#FFF', margin: 0 }}>
                SELECTED<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>PROJECTS</span>
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.15em', textAlign: 'right' }}>
                {PROJECTS.length} WORKS<br />2025–2026
              </span>
            </div>
          </div>

          {/* Project rows */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {PROJECTS.map((proj, i) => {
              const hov = hoveredProj === i;
              return (
                <div
                  key={proj.num}
                  className="portfolio-proj-row"
                  onClick={() => { audioFX.warp(); setSelectedProj(proj); }}
                  onMouseEnter={() => setHoveredProj(i)}
                  onMouseLeave={() => setHoveredProj(null)}
                  style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr 56px', alignItems: 'center', gap: 0,
                    padding: `${hov ? 30 : 22}px 36px`,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'none',
                    background: hov ? `rgba(172,255,70,0.04)` : 'transparent',
                    borderLeft: `2px solid ${hov ? ACCENT_DIM : 'transparent'}`,
                    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: hov ? ACCENT : 'rgba(255,255,255,0.16)', transition: 'color 0.3s', alignSelf: 'flex-start', paddingTop: 3 }}>{proj.num}</div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: hov ? ACCENT_DIM : 'rgba(255,255,255,0.16)', transition: 'color 0.3s' }}>{proj.type}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.1em' }}>{proj.year}</span>
                    </div>
                    <h3 style={{ fontWeight: 900, fontSize: 'clamp(1.2rem,3vw,2.2rem)', letterSpacing: '-0.025em', lineHeight: 1.1, color: '#FFF', marginBottom: 10, whiteSpace: 'pre-line' }}>{proj.title}</h3>
                    <div style={{ maxHeight: hov ? 80 : 0, overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)', marginBottom: hov ? 14 : 0 }}>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.75 }}>{proj.desc}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {proj.tags.map(t => (
                        <span key={t} style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '3px 8px', borderRadius: 2,
                          border: `1px solid ${hov ? ACCENT_DIM : 'rgba(255,255,255,0.1)'}`,
                          color: hov ? ACCENT : 'rgba(255,255,255,0.28)',
                          transition: 'all 0.3s',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <ArrowUpRight style={{
                    width: 18, height: 18,
                    color: hov ? ACCENT : 'rgba(255,255,255,0.13)',
                    transform: hov ? 'translate(3px,-3px)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    alignSelf: 'flex-start', marginTop: 4,
                  }} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ CHAPTER 3 — SKILLS (WHITE) ═════════════════════ */}
        <section ref={skillsRef} id="yp-skills" style={{ background: '#FFF', color: '#000', padding: '80px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ display: 'block', width: 30, height: 1, background: 'rgba(0,0,0,0.28)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.36)' }}>Chapter 03 — Skills</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 52 }}>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(3rem,9vw,7rem)', letterSpacing: '-0.04em', lineHeight: 0.9, color: '#000', margin: 0 }}>
              TECHNICAL<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(0,0,0,0.22)' }}>SKILLS</span>
            </h2>
          </div>

          <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
            {[
              { cat: 'Blockchain', items: ['Hyperledger Besu', 'ERC-4337', 'QBFT Consensus', 'Tessera', 'Web3.js', 'go-ethereum'] },
              { cat: 'Languages', items: ['TypeScript', 'Solidity', 'Go', 'Python', 'Java', 'C++'] },
              { cat: 'Cryptography', items: ['RSA-2048', 'AES-256-GCM', 'SHA-256', 'WebAuthn', 'Zero-Trust', 'SCSVS Audit'] },
              { cat: 'Frontend', items: ['React', 'Three.js', 'WebGL', 'Vite', 'GSAP', 'CSS Animations'] },
              { cat: 'Backend', items: ['Node.js', 'Express', 'REST API', 'Foundry', 'Hardhat', 'MySQL'] },
            ].map((g) => (
              <div key={g.cat} className="portfolio-skill-item" style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 40, padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>{g.cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {g.items.map(item => (
                    <span key={item}
                      style={{ fontSize: 12, fontWeight: 600, padding: '6px 15px', borderRadius: 999, border: '1.5px solid rgba(0,0,0,0.1)', color: '#000', background: 'transparent', cursor: 'default', transition: 'all 0.22s' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#000'; el.style.color = '#FFF'; el.style.borderColor = '#000'; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#000'; el.style.borderColor = 'rgba(0,0,0,0.1)'; }}
                    >{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div style={{ marginTop: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
              <span style={{ display: 'block', width: 30, height: 1, background: 'rgba(0,0,0,0.28)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.36)' }}>Journey</span>
            </div>
            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'rgba(0,0,0,0.1)', transformOrigin: 'top', animation: 'line-draw 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s both' }} />
              {TIMELINE.map((t, i) => (
                <div key={t.year} className="portfolio-timeline-item" style={{ display: 'flex', gap: 28, marginBottom: 36, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: -32 - 5, top: 5, width: 11, height: 11, borderRadius: '50%', background: i === 0 ? '#000' : '#FFF', border: `1.5px solid ${i === 0 ? '#000' : 'rgba(0,0,0,0.22)'}`, flexShrink: 0, zIndex: 1 }} />
                  <div>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 5, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.32)', letterSpacing: '0.1em' }}>{t.year}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#000' }}>{t.role}</span>
                      <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)' }}>— {t.co}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.48)', lineHeight: 1.75, margin: 0 }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ MARQUEE STRIP 3 ════════════════════════════════ */}
        <div style={{ borderTop: `1px solid rgba(172,255,70,0.1)`, borderBottom: `1px solid rgba(172,255,70,0.1)`, padding: '13px 0', background: '#050505', overflow: 'hidden' }}>
          <Marquee items={["Let's Build Together", 'Open to Opportunities', 'MCA 2026', 'Blockchain Native', 'Zero Trust Security', 'Web3 Engineer', 'Shashank Sharma']} speed={28} />
        </div>

        {/* ══ CHAPTER 4 — CONTACT (BLACK) ════════════════════ */}
        <section ref={contactRef} id="yp-contact" style={{ background: '#000', minHeight: '85%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 36px', position: 'relative', overflow: 'hidden' }}>
          {/* Green glow centre */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: `radial-gradient(circle, ${ACCENT_GLOW} 0%, transparent 70%)`, pointerEvents: 'none', filter: 'blur(70px)' }} />

          <div style={{ position: 'absolute', bottom: -80, right: -40, fontWeight: 900, fontSize: 'clamp(10rem,30vw,26rem)', letterSpacing: '-0.06em', lineHeight: 1, color: 'transparent', WebkitTextStroke: `1px ${ACCENT_GLOW.replace('0.35', '0.04')}`, userSelect: 'none', pointerEvents: 'none' }}>BUILD</div>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div className="gsap-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
              <span style={{ display: 'block', width: 30, height: 1, background: ACCENT_DIM }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: ACCENT }}>Chapter 04 — Contact</span>
            </div>

            <h2 className="gsap-fade-up" style={{ fontWeight: 900, fontSize: 'clamp(3.5rem,12vw,10rem)', letterSpacing: '-0.05em', lineHeight: 0.88, color: '#FFF', marginBottom: 0 }}>
              LET'S<br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}>BUILD</span><br />
              TOGETHER.
            </h2>

            <div className="gsap-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 52, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' }}>
              <a href={`mailto:${PROFILE.email}`}
                onClick={() => audioFX.warp()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 28px', borderRadius: 999, background: ACCENT, color: '#000', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-mono)', transition: 'all 0.3s', boxShadow: `0 0 32px ${ACCENT_GLOW}` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 54px rgba(172,255,70,0.65)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${ACCENT_GLOW}`; }}
              >
                <Mail style={{ width: 14, height: 14 }} /> Send Email
              </a>

              {[
                { label: 'GitHub', href: PROFILE.github, icon: <Github style={{ width: 13, height: 13 }} /> },
                { label: 'LinkedIn', href: PROFILE.linkedin, icon: <Linkedin style={{ width: 13, height: 13 }} /> },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  onClick={() => audioFX.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 22px', borderRadius: 999, border: `1px solid rgba(255,255,255,0.15)`, color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', fontFamily: 'var(--font-mono)', transition: 'all 0.25s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = ACCENT_DIM; el.style.color = ACCENT; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'rgba(255,255,255,0.6)'; }}
                >{s.icon}{s.label}</a>
              ))}

              <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.12em' }}>
                {PROFILE.email}
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer style={{ borderTop: `1px solid ${ACCENT_GLOW.replace('0.35', '0.1')}`, padding: '20px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#000' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.16)', letterSpacing: '0.15em' }}>
            © 2026 SHASHANK SHARMA
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Hyperledger Besu', 'ERC-4337', 'React', 'Three.js', 'Solidity'].map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t}</span>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: ACCENT_DIM, letterSpacing: '0.15em' }}>
            MCA SEM 3 · dOS
          </div>
        </footer>
      </div>
    </div>
  );
};
