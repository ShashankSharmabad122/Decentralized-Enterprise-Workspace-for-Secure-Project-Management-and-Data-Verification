import React, { useState, useEffect } from 'react';
import {
  Award, CheckCircle2, Clock, ShieldCheck, Send, RefreshCw,
  Zap, GitBranch, Lock, Activity, AlertTriangle, ChevronRight,
  TrendingUp, FileText, User2, CircleDot,
} from 'lucide-react';
import { ProjectMilestone } from '../../types';

/* ── Static demo milestones (API-backed when server is live) ── */
const DEMO_MILESTONES: ProjectMilestone[] = [
  {
    id: 'ms-001',
    title: 'Phase 1 — Architecture & Smart Contracts',
    description:
      'Deliver dOS system topology diagram, FileHashRegistry.sol, ProjectMilestones.sol, SmartAccountPaymaster.sol, and QBFT Besu network genesis configuration.',
    status: 'RELEASED',
    allocatedBudgetEth: '0.85',
    assignee: 'Shashank Sharma',
    proofSha256: '0xa3f4b2...d9e1c7',
    smartContractTx: '0x8f2c91a3b4e5d6f7890123456789abcdef0123456789abcdef0123456789abcd',
  },
  {
    id: 'ms-002',
    title: 'Phase 2 — RSA-AES Cryptographic Vault',
    description:
      'AES-256-GCM file encryption pipeline with RSA-2048 key wrapping, SHA-256 fingerprinting, MySQL sharding (Alpha/Beta/Gamma), and tamper detection.',
    status: 'RELEASED',
    allocatedBudgetEth: '1.20',
    assignee: 'Shashank Sharma',
    proofSha256: '0xb7e3d1...f2a890',
    smartContractTx: '0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01',
  },
  {
    id: 'ms-003',
    title: 'Phase 3 — ERC-4337 Smart Account Layer',
    description:
      'WebAuthn passkey authentication, session key issuance with scoped permissions (SCOPE_READ_VAULT, SCOPE_REGISTER_HASH), and Paymaster gas sponsorship engine.',
    status: 'PROOF_SUBMITTED',
    allocatedBudgetEth: '0.95',
    assignee: 'Shashank Sharma',
    proofSha256: '0xc9d2e4...81a3f5',
    smartContractTx: 'Pending multi-sig approval…',
  },
  {
    id: 'ms-004',
    title: 'Phase 4 — Security Audit & SCSVS Compliance',
    description:
      'Foundry unit + fuzz testing, SCSVS security audit scan (Reentrancy, Access Control, SafeMath), full production build validation, and project report submission.',
    status: 'IN_PROGRESS',
    allocatedBudgetEth: '0.60',
    assignee: 'Shashank Sharma',
    proofSha256: 'Pending…',
    smartContractTx: 'Pending…',
  },
];

/* ── Status config ────────────────────────────────────────────── */
const STATUS_CFG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  RELEASED: {
    label: 'RELEASED',
    color: '#6ee7b7',
    bg: 'rgba(110,231,183,0.08)',
    border: 'rgba(110,231,183,0.25)',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  PROOF_SUBMITTED: {
    label: 'PROOF SUBMITTED',
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.08)',
    border: 'rgba(251,191,36,0.25)',
    icon: <Send className="w-3.5 h-3.5" />,
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.25)',
    icon: <Activity className="w-3.5 h-3.5" />,
  },
  CREATED: {
    label: 'CREATED',
    color: '#4a9ab5',
    bg: 'rgba(74,154,181,0.08)',
    border: 'rgba(74,154,181,0.25)',
    icon: <CircleDot className="w-3.5 h-3.5" />,
  },
  DISPUTED: {
    label: 'DISPUTED',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.08)',
    border: 'rgba(248,113,113,0.25)',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
};

/* ── Animated counter ──────────────────────────────────────── */
const AnimCounter: React.FC<{ target: number; prefix?: string; suffix?: string }> = ({
  target, prefix = '', suffix = '',
}) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame = 0;
    const frames = 48;
    const tick = () => {
      frame++;
      setVal(Math.round((frame / frames) * target));
      if (frame < frames) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <>{prefix}{val}{suffix}</>;
};

/* ── Main component ─────────────────────────────────────────── */
export const ProjectMilestoneManager: React.FC = () => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(DEMO_MILESTONES);
  const [loading, setLoading] = useState(false);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('ms-003');
  const [releaseLog, setReleaseLog] = useState<string[]>([]);

  /* Try to sync from API (falls back to demo data) */
  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects/milestones');
      const data = await res.json();
      if (data.milestones?.length) setMilestones(data.milestones);
    } catch {
      /* use demo data */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMilestones(); }, []);

  /* Release escrow simulation */
  const handleReleaseBudget = async (ms: ProjectMilestone) => {
    setReleasingId(ms.id);
    setReleaseLog([]);

    const steps = [
      `[1/4] Verifying SHA-256 proof hash on-chain: ${ms.proofSha256}`,
      `[2/4] Multi-sig threshold reached (2/2 approvals collected)`,
      `[3/4] Paymaster-sponsored UserOp submitted to QBFT mempool`,
      `[4/4] ✓ Escrow of ${ms.allocatedBudgetEth} ETH released — Block #10${Math.floor(Math.random() * 999)}`,
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, 700));
      setReleaseLog(prev => [...prev, step]);
    }

    await new Promise(r => setTimeout(r, 400));
    setMilestones(prev =>
      prev.map(m => m.id === ms.id ? { ...m, status: 'RELEASED' } : m),
    );
    setReleasingId(null);
  };

  /* Stats */
  const released = milestones.filter(m => m.status === 'RELEASED').length;
  const totalEth = milestones.reduce((sum, m) => sum + parseFloat(m.allocatedBudgetEth), 0);
  const releasedEth = milestones
    .filter(m => m.status === 'RELEASED')
    .reduce((sum, m) => sum + parseFloat(m.allocatedBudgetEth), 0);

  return (
    <div className="app-root" style={{ background: '#030810', overflowY: 'auto' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding: '22px 24px 18px',
        borderBottom: '1px solid rgba(74,154,181,0.1)',
        background: 'rgba(4,13,20,0.8)',
        backdropFilter: 'blur(20px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 13,
              background: 'linear-gradient(135deg, rgba(74,154,181,0.2), rgba(30,122,154,0.1))',
              border: '1px solid rgba(74,154,181,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a9ab5',
            }}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: '#e8f4f8', margin: 0 }}>
                Smart Contract Milestone & Escrow Engine
              </h2>
              <p style={{ fontSize: 11, color: 'rgba(184,217,232,0.45)', margin: 0, fontFamily: 'var(--font-mono)' }}>
                ProjectMilestones.sol · Hyperledger Besu QBFT · Multi-sig Release
              </p>
            </div>
          </div>
          <button
            onClick={fetchMilestones}
            disabled={loading}
            className="btn-ice"
            style={{ padding: '7px 14px', fontSize: 11, gap: 6 }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing…' : 'Sync Escrow'}
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Total Phases', value: milestones.length, suffix: '', color: '#4a9ab5', icon: <GitBranch className="w-3.5 h-3.5" /> },
            { label: 'Released',     value: released,           suffix: `/ ${milestones.length}`, color: '#6ee7b7', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { label: 'ETH Released', value: releasedEth,        suffix: ' ETH', color: '#fbbf24', icon: <Zap className="w-3.5 h-3.5" /> },
            { label: 'Total Budget', value: totalEth,           suffix: ' ETH', color: '#a78bfa', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          ].map(s => (
            <div key={s.label} className="ice-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                background: `${s.color}14`, border: `1px solid ${s.color}28`, color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#e8f4f8', lineHeight: 1 }}>
                  <AnimCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)', marginTop: 3 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Timeline ────────────────────────────────────────── */}
      <div style={{ padding: '20px 24px' }}>

        {/* Overall progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)' }}>
              Project Completion
            </span>
            <span className="font-mono" style={{ fontSize: 10, color: '#6ee7b7' }}>
              {Math.round((released / milestones.length) * 100)}%
            </span>
          </div>
          <div className="ice-progress" style={{ height: 6 }}>
            <div
              className="ice-progress-fill"
              style={{ width: `${(released / milestones.length) * 100}%`, background: 'linear-gradient(90deg, #4a9ab5, #6ee7b7)' }}
            />
          </div>
        </div>

        {/* Milestones list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {milestones.map((ms, idx) => {
            const cfg = STATUS_CFG[ms.status] ?? STATUS_CFG.CREATED;
            const isExpanded = expandedId === ms.id;
            const isReleasing = releasingId === ms.id;

            return (
              <div
                key={ms.id}
                className="ice-card"
                style={{
                  padding: 0, overflow: 'hidden',
                  borderColor: isExpanded ? `${cfg.color}30` : 'rgba(74,154,181,0.12)',
                  boxShadow: isExpanded ? `0 0 28px ${cfg.color}10` : undefined,
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
              >
                {/* Card header — click to expand */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ms.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  {/* Phase number */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: `${cfg.color}14`, border: `1px solid ${cfg.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: cfg.color,
                  }}>
                    {idx + 1}
                  </div>

                  {/* Title */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#e8f4f8' }}>{ms.title}</span>
                      {/* Status pill */}
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                          padding: '2px 8px', borderRadius: 6, flexShrink: 0,
                          background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.35)' }}>
                      Budget: {ms.allocatedBudgetEth} ETH · Assignee: {ms.assignee}
                    </div>
                  </div>

                  {/* ETH amount */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: cfg.color }}>{ms.allocatedBudgetEth} ETH</div>
                    <div className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.3)' }}>ESCROW</div>
                  </div>

                  <ChevronRight
                    className="w-4 h-4"
                    style={{
                      color: 'rgba(184,217,232,0.35)', flexShrink: 0,
                      transform: isExpanded ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.25s',
                    }}
                  />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${cfg.color}14` }}>
                    <p style={{ fontSize: 12, color: 'rgba(184,217,232,0.5)', lineHeight: 1.7, marginBottom: 16, marginTop: 14 }}>
                      {ms.description}
                    </p>

                    {/* Metadata grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                      <div className="ice-card" style={{ padding: '12px 14px' }}>
                        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.35)', marginBottom: 5 }}>
                          <User2 className="w-3 h-3" style={{ display: 'inline', marginRight: 4 }} />Assignee
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#b8d9e8' }}>{ms.assignee}</div>
                      </div>
                      <div className="ice-card" style={{ padding: '12px 14px' }}>
                        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.35)', marginBottom: 5 }}>
                          <Lock className="w-3 h-3" style={{ display: 'inline', marginRight: 4 }} />Proof SHA-256
                        </div>
                        <div className="font-mono" style={{ fontSize: 11, color: '#4a9ab5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ms.proofSha256}
                        </div>
                      </div>
                      <div className="ice-card" style={{ padding: '12px 14px', gridColumn: '1 / -1' }}>
                        <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.35)', marginBottom: 5 }}>
                          <FileText className="w-3 h-3" style={{ display: 'inline', marginRight: 4 }} />Smart Contract Tx Hash
                        </div>
                        <div className="font-mono" style={{ fontSize: 11, color: ms.status === 'RELEASED' ? '#6ee7b7' : 'rgba(184,217,232,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ms.smartContractTx}
                        </div>
                      </div>
                    </div>

                    {/* Release log (while releasing) */}
                    {isReleasing && releaseLog.length > 0 && (
                      <div className="ice-card font-mono" style={{
                        padding: '12px 14px', marginBottom: 14,
                        background: 'rgba(74,154,181,0.05)', border: '1px solid rgba(74,154,181,0.2)',
                        fontSize: 11, lineHeight: 1.8,
                      }}>
                        {releaseLog.map((line, i) => (
                          <div key={i} style={{ color: i === releaseLog.length - 1 ? '#6ee7b7' : 'rgba(184,217,232,0.55)' }}>
                            {line}
                          </div>
                        ))}
                        {isReleasing && <div className="ice-spinner" style={{ marginTop: 6 }} />}
                      </div>
                    )}

                    {/* CTA */}
                    {ms.status === 'RELEASED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6ee7b7', fontSize: 12, fontWeight: 700 }}>
                        <ShieldCheck className="w-4 h-4" />
                        Budget escrow released via smart contract — QBFT finalized
                      </div>
                    ) : ms.status === 'PROOF_SUBMITTED' ? (
                      <button
                        onClick={() => handleReleaseBudget(ms)}
                        disabled={!!releasingId}
                        className="btn-ice-primary"
                        style={{ padding: '9px 18px', fontSize: 12, gap: 7, opacity: releasingId ? 0.5 : 1 }}
                      >
                        <Send className="w-4 h-4" />
                        {isReleasing ? 'Submitting UserOp…' : `Verify Proof & Release ${ms.allocatedBudgetEth} ETH Escrow`}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: cfg.color, fontSize: 11 }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Awaiting proof submission to unlock escrow release</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Smart Contract ABI Preview */}
        <div className="ice-card" style={{ marginTop: 20, padding: '16px 18px' }}>
          <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)', marginBottom: 10 }}>
            ProjectMilestones.sol — Smart Contract Interface
          </div>
          <pre style={{
            background: 'rgba(2,8,14,0.8)', border: '1px solid rgba(74,154,181,0.12)',
            borderRadius: 10, padding: '14px 16px',
            fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
            color: 'rgba(184,217,232,0.55)', overflowX: 'auto', margin: 0,
          }}>
{`// Hyperledger Besu QBFT — EVM Compatible
contract ProjectMilestones {
  enum Status { CREATED, IN_PROGRESS, PROOF_SUBMITTED, RELEASED }

  struct Milestone {
    uint256 id;
    string  title;
    uint256 budgetWei;        // Escrow amount
    Status  status;
    bytes32 proofSha256;      // SHA-256 of deliverable
    address assignee;
    uint256 approvalsCount;   // Multi-sig threshold = 2
  }

  event MilestoneReleased(uint256 indexed id, uint256 budgetWei);

  function approveMilestone(uint256 _id) external {
    Milestone storage m = milestones[_id];
    require(m.status == Status.PROOF_SUBMITTED);
    if (++m.approvalsCount >= 2) {
      m.status = Status.RELEASED;
      emit MilestoneReleased(_id, m.budgetWei);
    }
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};
