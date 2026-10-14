import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Key, CreditCard, Fingerprint, Plus,
  Zap, CheckCircle2, Clock, Trash2, AlertTriangle,
  Activity, Lock, Cpu, ChevronRight, RefreshCw,
  Eye, EyeOff,
} from 'lucide-react';
import { UserAccount } from '../../types';

/* ── Types ──────────────────────────────────────────────────── */
interface SessionKey {
  id: string;
  name: string;
  scopedTarget: string;
  scope: string;
  expiresAt: number; // epoch ms
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
}

interface PaymasterLog {
  txHash: string;
  method: string;
  sponsoredAmount: string;
  gasCostEth: number;
  timestamp: string;
  status: 'SPONSORED_SUCCESS' | 'FAILED';
  userOpHash: string;
}

/* ── Static demo data ────────────────────────────────────────── */
const SCOPE_LABELS: Record<string, string> = {
  SCOPE_READ_VAULT:     'Read Encrypted Vault Files',
  SCOPE_REGISTER_HASH:  'Register SHA-256 Hashes on Besu',
  SCOPE_APPROVE_MILESTONE: 'Approve Milestone Proof & Release Escrow',
  SCOPE_FULL_ADMIN:     'Enterprise Admin (All Permissions)',
};

const SCOPE_COLORS: Record<string, string> = {
  SCOPE_READ_VAULT:       '#4a9ab5',
  SCOPE_REGISTER_HASH:    '#6ee7b7',
  SCOPE_APPROVE_MILESTONE:'#fbbf24',
  SCOPE_FULL_ADMIN:       '#f87171',
};

const INITIAL_KEYS: SessionKey[] = [
  {
    id: 'sk-101',
    name: 'RSA Vault Read Session',
    scopedTarget: '0xFileHashRegistryAddr_0x3a4b5c6d',
    scope: 'SCOPE_READ_VAULT',
    expiresAt: Date.now() + 4 * 3600_000 + 12 * 60_000,
    status: 'ACTIVE',
    createdAt: '2 hours ago',
  },
  {
    id: 'sk-102',
    name: 'Milestone Release Key',
    scopedTarget: '0xProjectMilestonesAddr_0x8f2c91a3',
    scope: 'SCOPE_APPROVE_MILESTONE',
    expiresAt: Date.now() + 23 * 3600_000 + 59 * 60_000,
    status: 'ACTIVE',
    createdAt: '15 mins ago',
  },
];

const INITIAL_LOGS: PaymasterLog[] = [
  {
    txHash: '0x3a4b5c6d7e8f90123456789abcdef0123456789ab',
    method: 'registerFileHash()',
    sponsoredAmount: '0.0014 ETH',
    gasCostEth: 0.0014,
    timestamp: '2 mins ago',
    status: 'SPONSORED_SUCCESS',
    userOpHash: '0xUserOp_f2a890b7e3d1c8d9f56a23e7',
  },
  {
    txHash: '0x8f2c91a3b4e5d6f7890123456789abcdef0123456',
    method: 'verifyMilestoneProof()',
    sponsoredAmount: '0.0028 ETH',
    gasCostEth: 0.0028,
    timestamp: '18 mins ago',
    status: 'SPONSORED_SUCCESS',
    userOpHash: '0xUserOp_c9d2e481a3f5b7e3',
  },
  {
    txHash: '0xc9d2e481a3f5b7e3d1f890123456789abcdef0123',
    method: 'validateAndSponsorPaymasterOp()',
    sponsoredAmount: '0.0009 ETH',
    gasCostEth: 0.0009,
    timestamp: '1 hour ago',
    status: 'SPONSORED_SUCCESS',
    userOpHash: '0xUserOp_a3b4c5d6e7f8',
  },
];

/* ── Countdown hook ─────────────────────────────────────────── */
function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(expiresAt - Date.now());
  useEffect(() => {
    const interval = setInterval(() => setRemaining(expiresAt - Date.now()), 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);
  const totalSec = Math.max(0, Math.floor(remaining / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${m}m ${s}s`;
}

/* ── Session key card ───────────────────────────────────────── */
const SessionKeyCard: React.FC<{
  sk: SessionKey;
  onRevoke: (id: string) => void;
  showHash: boolean;
}> = ({ sk, onRevoke, showHash }) => {
  const countdown = useCountdown(sk.expiresAt);
  const color = SCOPE_COLORS[sk.scope] ?? '#4a9ab5';
  const isActive = sk.status === 'ACTIVE';

  return (
    <div className="ice-card" style={{
      padding: '14px 16px',
      borderColor: isActive ? `${color}22` : 'rgba(74,154,181,0.08)',
      opacity: isActive ? 1 : 0.5,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}14`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            <Key className="w-3.5 h-3.5" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#e8f4f8' }}>{sk.name}</div>
            <div className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.4)' }}>ID: {sk.id} · {sk.createdAt}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span className="font-mono" style={{
            fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
            background: isActive ? 'rgba(110,231,183,0.1)' : 'rgba(248,113,113,0.1)',
            border: `1px solid ${isActive ? 'rgba(110,231,183,0.25)' : 'rgba(248,113,113,0.25)'}`,
            color: isActive ? '#6ee7b7' : '#f87171',
          }}>
            {sk.status}
          </span>
          {isActive && (
            <button
              onClick={() => onRevoke(sk.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.5)', padding: 2 }}
              title="Revoke key"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scope */}
      <div style={{ marginBottom: 8 }}>
        <span className="font-mono" style={{
          fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
          background: `${color}0e`, border: `1px solid ${color}22`, color,
        }}>
          {sk.scope}
        </span>
        <span style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', marginLeft: 7 }}>
          — {SCOPE_LABELS[sk.scope]}
        </span>
      </div>

      {/* Target */}
      <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.35)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Target: {showHash ? sk.scopedTarget : sk.scopedTarget.slice(0, 18) + '●●●●●●●●●●'}
      </div>

      {/* Countdown */}
      {isActive && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Clock className="w-3 h-3" style={{ color: '#fbbf24' }} />
          <span className="font-mono" style={{ fontSize: 10, color: '#fbbf24' }}>Expires in: {countdown}</span>
        </div>
      )}
    </div>
  );
};

/* ── Issue key modal ─────────────────────────────────────────── */
const IssueKeyModal: React.FC<{
  onIssue: (name: string, scope: string, duration: number) => void;
  onClose: () => void;
}> = ({ onIssue, onClose }) => {
  const [name, setName] = useState('');
  const [scope, setScope] = useState('SCOPE_READ_VAULT');
  const [duration, setDuration] = useState(4);
  const [issuing, setIssuing] = useState(false);

  const handle = async () => {
    setIssuing(true);
    await new Promise(r => setTimeout(r, 900));
    onIssue(name || 'Custom Session Key', scope, duration);
    setIssuing(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="ice-card" style={{ width: 440, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#e8f4f8', margin: 0 }}>
            Issue New Session Key
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(184,217,232,0.4)', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,217,232,0.45)', display: 'block', marginBottom: 6 }}>
              Key Name
            </label>
            <input
              className="ice-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. File Vault Read Session"
            />
          </div>

          <div>
            <label className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,217,232,0.45)', display: 'block', marginBottom: 6 }}>
              Permission Scope
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(SCOPE_LABELS).map(([s, label]) => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 10px', borderRadius: 8, border: `1px solid ${scope === s ? `${SCOPE_COLORS[s]}40` : 'rgba(74,154,181,0.1)'}`, background: scope === s ? `${SCOPE_COLORS[s]}08` : 'transparent', transition: 'all 0.2s' }}>
                  <input type="radio" name="scope" value={s} checked={scope === s} onChange={() => setScope(s)} style={{ accentColor: SCOPE_COLORS[s] }} />
                  <div>
                    <div className="font-mono" style={{ fontSize: 9, fontWeight: 700, color: SCOPE_COLORS[s] }}>{s}</div>
                    <div style={{ fontSize: 11, color: 'rgba(184,217,232,0.5)' }}>{label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,217,232,0.45)', display: 'block', marginBottom: 6 }}>
              Expiry Duration
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 4, 8, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  style={{
                    flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${duration === h ? 'rgba(74,154,181,0.5)' : 'rgba(74,154,181,0.15)'}`,
                    background: duration === h ? 'rgba(74,154,181,0.15)' : 'transparent',
                    color: duration === h ? '#b8d9e8' : 'rgba(184,217,232,0.4)',
                    cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                    transition: 'all 0.2s',
                  }}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handle}
            disabled={issuing}
            className="btn-ice-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px', marginTop: 4 }}
          >
            {issuing
              ? <><div className="ice-spinner" style={{ width: 14, height: 14 }} /> Issuing WebAuthn Key…</>
              : <><Key className="w-4 h-4" /> Issue Session Key via Passkey</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ─────────────────────────────────────────── */
interface SmartAccountsAuthProps {
  user: UserAccount;
}

export const SmartAccountsAuth: React.FC<SmartAccountsAuthProps> = ({ user }) => {
  const [sessionKeys, setSessionKeys] = useState<SessionKey[]>(INITIAL_KEYS);
  const [paymasterLogs, setPaymasterLogs] = useState<PaymasterLog[]>(INITIAL_LOGS);
  const [showModal, setShowModal] = useState(false);
  const [showHashes, setShowHashes] = useState(false);
  const [activeTab, setActiveTab] = useState<'KEYS' | 'PAYMASTER' | 'USEROP'>('KEYS');
  const [totalSponsored, setTotalSponsored] = useState(0);

  useEffect(() => {
    setTotalSponsored(paymasterLogs.reduce((s, l) => s + l.gasCostEth, 0));
  }, [paymasterLogs]);

  const handleIssue = (name: string, scope: string, hours: number) => {
    const newKey: SessionKey = {
      id: `sk-${Date.now().toString().slice(-4)}`,
      name,
      scopedTarget: `0x${scope.slice(-8)}_Contract_0x${Math.random().toString(16).slice(2, 10)}`,
      scope,
      expiresAt: Date.now() + hours * 3600_000,
      status: 'ACTIVE',
      createdAt: 'just now',
    };
    setSessionKeys(prev => [newKey, ...prev]);

    /* Log new paymaster tx */
    const newLog: PaymasterLog = {
      txHash: `0x${Math.random().toString(16).slice(2, 42)}`,
      method: `issueSessionKey(${scope})`,
      sponsoredAmount: '0.0006 ETH',
      gasCostEth: 0.0006,
      timestamp: 'just now',
      status: 'SPONSORED_SUCCESS',
      userOpHash: `0xUserOp_${Math.random().toString(16).slice(2, 18)}`,
    };
    setPaymasterLogs(prev => [newLog, ...prev]);
  };

  const handleRevoke = (id: string) => {
    setSessionKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'REVOKED' } : k));
  };

  const activeKeys = sessionKeys.filter(k => k.status === 'ACTIVE').length;
  const tabs = [
    { id: 'KEYS' as const, label: 'Session Keys', icon: <Key className="w-3.5 h-3.5" /> },
    { id: 'PAYMASTER' as const, label: 'Paymaster Logs', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'USEROP' as const, label: 'UserOp Builder', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="app-root" style={{ background: '#030810' }}>
      {showModal && <IssueKeyModal onIssue={handleIssue} onClose={() => setShowModal(false)} />}

      {/* ── Account banner ──────────────────────────────────── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(74,154,181,0.1)',
        background: 'rgba(4,13,20,0.85)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(74,154,181,0.3), rgba(30,122,154,0.15))',
            border: '1px solid rgba(74,154,181,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a9ab5',
            boxShadow: '0 0 28px rgba(74,154,181,0.25)',
            flexShrink: 0,
          }}>
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: '#e8f4f8' }}>{user.name}</span>
              <span className="ice-badge" style={{ fontSize: 9, padding: '2px 8px' }}>ERC-4337 Smart Account</span>
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: '#4a9ab5', marginBottom: 2 }}>{user.address}</div>
            <div style={{ fontSize: 11, color: 'rgba(184,217,232,0.4)' }}>
              Role: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{user.role}</span>
              <span style={{ marginLeft: 14, color: '#6ee7b7' }}>✓ WebAuthn Passkey Active</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            {[
              { label: 'Active Keys', value: `${activeKeys}`, color: '#6ee7b7', icon: <Key className="w-3 h-3" /> },
              { label: 'Gas Sponsored', value: `${totalSponsored.toFixed(4)} ETH`, color: '#fbbf24', icon: <Zap className="w-3 h-3" /> },
              { label: 'Paymaster', value: user.paymasterBalance, color: '#4a9ab5', icon: <Activity className="w-3 h-3" /> },
            ].map(s => (
              <div key={s.label} className="ice-card" style={{ padding: '10px 12px', textAlign: 'center', minWidth: 90 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: s.color, marginBottom: 4 }}>
                  {s.icon}
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{s.value}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 8, color: 'rgba(184,217,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: '8px 8px 0 0',
                border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                fontFamily: 'var(--font-body)',
                background: activeTab === tab.id ? 'rgba(74,154,181,0.12)' : 'transparent',
                color: activeTab === tab.id ? '#b8d9e8' : 'rgba(184,217,232,0.4)',
                borderBottom: activeTab === tab.id ? '2px solid #4a9ab5' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="app-body">

        {/* ── Session Keys tab ────────────────────────────── */}
        {activeTab === 'KEYS' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f4f8' }}>Active Session Keys</span>
                <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', marginLeft: 8 }}>
                  {activeKeys} active · {sessionKeys.length - activeKeys} revoked/expired
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowHashes(!showHashes)}
                  className="btn-ice"
                  style={{ padding: '6px 12px', fontSize: 11, gap: 5 }}
                >
                  {showHashes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showHashes ? 'Hide' : 'Reveal'} Targets
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-ice-primary"
                  style={{ padding: '6px 14px', fontSize: 11, gap: 5 }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Issue Session Key
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessionKeys.map(sk => (
                <SessionKeyCard key={sk.id} sk={sk} onRevoke={handleRevoke} showHash={showHashes} />
              ))}
            </div>

            {/* Permission scope legend */}
            <div className="ice-card" style={{ padding: '14px 16px', marginTop: 14 }}>
              <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)', marginBottom: 10 }}>
                ERC-4337 Permission Scope Reference
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {Object.entries(SCOPE_LABELS).map(([s, label]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: SCOPE_COLORS[s], flexShrink: 0 }} />
                    <div>
                      <div className="font-mono" style={{ fontSize: 9, color: SCOPE_COLORS[s], fontWeight: 700 }}>{s}</div>
                      <div style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)' }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Paymaster Logs tab ──────────────────────────── */}
        {activeTab === 'PAYMASTER' && (
          <div>
            {/* Gas summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { label: 'Total Sponsored', value: `${totalSponsored.toFixed(4)} ETH`, color: '#fbbf24' },
                { label: 'Transactions',    value: `${paymasterLogs.length}`,           color: '#6ee7b7' },
                { label: 'Success Rate',    value: '100%',                               color: '#4a9ab5' },
              ].map(s => (
                <div key={s.label} className="ice-card" style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: s.color, marginBottom: 3 }}>{s.value}</div>
                  <div className="font-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,217,232,0.35)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {paymasterLogs.map((log, i) => (
                <div key={i} className="ice-card" style={{ padding: '14px 16px', borderColor: 'rgba(110,231,183,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#6ee7b7', flexShrink: 0 }} />
                      <span className="font-mono" style={{ fontSize: 12, color: '#4a9ab5', fontWeight: 700 }}>{log.method}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>{log.sponsoredAmount}</span>
                      <span className="font-mono" style={{ fontSize: 9, color: 'rgba(110,231,183,0.7)', background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.2)', padding: '2px 7px', borderRadius: 5 }}>
                        SPONSORED
                      </span>
                    </div>
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.35)', marginBottom: 4 }}>
                    TxHash: {log.txHash.slice(0, 28)}…
                  </div>
                  <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.25)', marginBottom: 6 }}>
                    UserOpHash: {log.userOpHash}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(74,154,181,0.08)' }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.3)' }}>Paymaster Gas Sponsor · Gasless UX</span>
                    <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.3)' }}>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── UserOp Builder tab ──────────────────────────── */}
        {activeTab === 'USEROP' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="ice-card" style={{ padding: '16px 18px' }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                ERC-4337 UserOperation Structure
              </div>
              <pre style={{
                background: 'rgba(2,8,14,0.85)', border: '1px solid rgba(74,154,181,0.12)',
                borderRadius: 10, padding: '14px 16px',
                fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.8,
                color: 'rgba(184,217,232,0.6)', overflowX: 'auto', margin: 0,
              }}>
{`// ERC-4337 UserOperation (dOS Smart Account)
UserOperation {
  sender:               "${user.address.slice(0, 28)}…",
  nonce:                0x0000000000000003,
  initCode:             "0x",           // account already deployed
  callData:             "0x" + calldata(registerFileHash),
  callGasLimit:         0x13880,        // 80,000 gas
  verificationGasLimit: 0xC350,         // 50,000 gas
  preVerificationGas:   0x5208,         // 21,000 gas (Paymaster covers)
  maxFeePerGas:         0x3B9ACA00,     // 1 Gwei (private QBFT)
  maxPriorityFeePerGas: 0x3B9ACA00,
  paymasterAndData:     SmartAccountPaymaster.addr + sponsorData,
  signature:            WebAuthn.P256.sign(userOpHash),  // Passkey CBOR
}`}
              </pre>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="ice-card" style={{ padding: '16px 18px' }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Passkey Signature Flow
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { step: '1', label: 'Compute userOpHash', color: '#4a9ab5' },
                    { step: '2', label: 'WebAuthn P-256 signing ceremony', color: '#6ee7b7' },
                    { step: '3', label: 'CBOR-encode authenticatorData', color: '#fbbf24' },
                    { step: '4', label: 'Submit UserOp to Bundler RPC', color: '#a78bfa' },
                    { step: '5', label: 'Paymaster validates & sponsors gas', color: '#6ee7b7' },
                    { step: '6', label: 'EntryPoint executes on Besu QBFT', color: '#4a9ab5' },
                  ].map(s => (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: `${s.color}14`, border: `1px solid ${s.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="font-mono" style={{ fontSize: 9, fontWeight: 800, color: s.color }}>{s.step}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'rgba(184,217,232,0.55)' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ice-card" style={{ padding: '16px 18px' }}>
                <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Smart Account Configuration
                </div>
                {[
                  { label: 'Smart Account ID', value: user.smartAccountId, color: '#4a9ab5' },
                  { label: 'EntryPoint v0.6',  value: '0x5FF137D4…', color: '#b8d9e8' },
                  { label: 'Passkey Enabled',  value: user.passkeyEnabled ? 'YES — WebAuthn P-256' : 'NO', color: '#6ee7b7' },
                  { label: 'Gas Model',        value: '100% Paymaster Sponsored', color: '#fbbf24' },
                  { label: 'Session Key',      value: `${user.sessionKey.slice(0, 18)}…`, color: '#a78bfa' },
                  { label: 'Network',          value: 'Hyperledger Besu QBFT', color: '#4a9ab5' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(74,154,181,0.07)' }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)' }}>{r.label}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: r.color, fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
