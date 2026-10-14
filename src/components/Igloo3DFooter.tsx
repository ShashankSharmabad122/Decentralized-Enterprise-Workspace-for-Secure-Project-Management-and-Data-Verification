import React, { useState } from 'react';
import { Zap, Shield, Database, Layers } from 'lucide-react';


// Physics-style ice footer with interactive shatter crystal widget
export const Igloo3DFooter: React.FC = () => {
  const [shattering, setShattering] = useState(false);

  const triggerShatter = () => {
    if (shattering) return;
    setShattering(true);
    setTimeout(() => setShattering(false), 700);
  };

  return (
    <footer
      className="mt-10"
      style={{
        background: 'rgba(2, 8, 14, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(74,154,181,0.1)',
        borderRadius: '20px',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Lightning flash on shatter */}
      {shattering && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(184,217,232,0.06)',
            borderRadius: 'inherit',
            animation: 'fadeIn 0.1s ease',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
        {/* Brand */}
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgba(74,154,181,0.6)' }}>
            Igloo.inc Inspired WebGL Universe
          </div>
          <h3 className="font-bold text-base mb-2" style={{ color: '#e8f4f8' }}>
            dOS · Decentralised Enterprise OS
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(184,217,232,0.4)' }}>
            Built with Three.js WebGL · Physical Ice Shaders · Web Audio API ·
            ERC-4337 Account Abstraction · Hyperledger Besu QBFT
          </p>
        </div>

        {/* Interactive crystal */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={triggerShatter}
            style={{
              width: 96, height: 96,
              borderRadius: 24,
              background: shattering
                ? 'rgba(184,217,232,0.12)'
                : 'rgba(74,154,181,0.08)',
              border: `1px solid rgba(74,154,181,${shattering ? '0.7' : '0.25'})`,
              cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s ease',
              boxShadow: shattering
                ? '0 0 40px rgba(184,217,232,0.25)'
                : '0 0 0 transparent',
              transform: shattering ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            <Zap
              className="w-8 h-8"
              style={{ color: shattering ? '#e8f4f8' : '#4a9ab5' }}
            />
            <span
              className="font-mono text-[9px] font-bold tracking-widest uppercase text-center"
              style={{ color: shattering ? '#b8d9e8' : 'rgba(74,154,181,0.7)' }}
            >
              {shattering ? 'SHATTER!' : 'ICE CRYSTAL'}
            </span>
          </button>
          <p className="font-mono text-[10px]" style={{ color: 'rgba(184,217,232,0.35)' }}>
            Physics Particle Container
          </p>
        </div>

        {/* Tech stack */}
        <div
          className="space-y-2.5 font-mono text-xs p-4 rounded-2xl"
          style={{
            background: 'rgba(4,13,20,0.6)',
            border: '1px solid rgba(74,154,181,0.1)',
          }}
        >
          {[
            { k: 'Renderer',     v: 'Three.js WebGL r169' },
            { k: 'Physics Mat',  v: 'MeshPhysical Ice' },
            { k: 'Audio',        v: 'Web Audio API' },
            { k: 'Consensus',    v: 'QBFT · Besu' },
            { k: 'Auth',         v: 'ERC-4337 Passkey' },
            { k: 'Developer',    v: 'Shashank Sharma' },
          ].map(row => (
            <div key={row.k} className="flex justify-between">
              <span style={{ color: 'rgba(184,217,232,0.4)' }}>{row.k}</span>
              <span style={{ color: '#7ab8d0' }}>{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
