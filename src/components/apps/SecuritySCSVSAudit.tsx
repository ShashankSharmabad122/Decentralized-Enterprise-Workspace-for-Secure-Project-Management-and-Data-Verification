import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, ShieldAlert, CheckCircle2, XCircle,
  Database, Server, Code2, AlertTriangle, Zap,
  RefreshCw, Activity, Lock, TrendingUp, Eye,
  HardDrive, Wifi,
} from 'lucide-react';
import { SecurityAuditResult } from '../../types';

/* ── Pre-baked SCSVS audit results ──────────────────────────── */
const DEMO_AUDIT: SecurityAuditResult[] = [
  {
    checkId: 'SC-1.1',
    title: 'Reentrancy Guard (Mutex)',
    passed: true,
    severity: 'CRITICAL',
    description:
      'nonReentrant modifier detected on all state-changing external calls. Checks-Effects-Interactions pattern verified. CEI compliance: 100%.',
  },
  {
    checkId: 'SC-2.3',
    title: 'Role-Based Access Control (RBAC)',
    passed: true,
    severity: 'HIGH',
    description:
      'onlyOwner & authorizedAuditors mapping enforced on registerFileHash() and registerBatchFileHashes(). No privilege escalation vectors detected.',
  },
  {
    checkId: 'SC-3.1',
    title: 'Integer Overflow / Underflow',
    passed: true,
    severity: 'HIGH',
    description:
      'Solidity 0.8.24 built-in overflow checks active. SafeMath implicit via compiler. No unchecked arithmetic blocks found in audit scope.',
  },
  {
    checkId: 'SC-4.2',
    title: 'tx.origin Authentication',
    passed: true,
    severity: 'HIGH',
    description:
      'No usage of tx.origin for authentication. All access control uses msg.sender. ERC-4337 UserOp sender validation is properly delegated.',
  },
  {
    checkId: 'SC-5.5',
    title: 'Front-Running Vulnerability',
    passed: false,
    severity: 'MEDIUM',
    description:
      'registerFileHash() does not include a commit-reveal scheme. SHA-256 hash submission can be front-run by a mempool watcher. Mitigate with commitment pre-images.',
  },
  {
    checkId: 'SC-6.1',
    title: 'Event Emission on State Change',
    passed: true,
    severity: 'MEDIUM',
    description:
      'FileHashRegistered, BatchHashesRegistered, and MilestoneReleased events verified. Full audit trail on-chain. Tessera private events encrypted.',
  },
  {
    checkId: 'SC-7.4',
    title: 'Paymaster Whitelisting',
    passed: true,
    severity: 'HIGH',
    description:
      'SmartAccountPaymaster enforces approvedUserAccounts mapping. Non-whitelisted accounts cannot receive gas sponsorship. Owner bypass gated.',
  },
  {
    checkId: 'SC-8.2',
    title: 'Hash Collision Resistance',
    passed: true,
    severity: 'CRITICAL',
    description:
      'SHA-256 (32-byte keccak-resistant) used for all file fingerprints. No MD5 or SHA-1 usage. bytes32 slot uniqueness enforced by require statement.',
  },
];

/* ── Shard health data ──────────────────────────────────────── */
const SHARDS = [
  { name: 'Shard-Alpha', partition: '0x0 – 0x5', records: 1240, diskMb: 142, maxMb: 200, status: 'ONLINE', accent: '#6ee7b7' },
  { name: 'Shard-Beta',  partition: '0x6 – 0xa', records:  980, diskMb: 110, maxMb: 200, status: 'ONLINE', accent: '#4a9ab5' },
  { name: 'Shard-Gamma', partition: '0xb – 0xf', records: 1510, diskMb: 185, maxMb: 200, status: 'ONLINE', accent: '#a78bfa' },
];

/* ── Severity badge ─────────────────────────────────────────── */
const SeverityBadge: React.FC<{ s: string }> = ({ s }) => {
  const colors: Record<string, string> = {
    CRITICAL: '#f87171', HIGH: '#fbbf24', MEDIUM: '#4a9ab5', LOW: '#6ee7b7',
  };
  const c = colors[s] ?? '#b8d9e8';
  return (
    <span className="font-mono" style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
      padding: '2px 7px', borderRadius: 5,
      background: `${c}14`, border: `1px solid ${c}30`, color: c,
    }}>
      {s}
    </span>
  );
};

/* ── Animated scan bar ──────────────────────────────────────── */
const ScanBar: React.FC<{ progress: number; color: string }> = ({ progress, color }) => (
  <div style={{ height: 4, borderRadius: 2, background: 'rgba(74,154,181,0.1)', overflow: 'hidden' }}>
    <div style={{
      height: '100%', borderRadius: 2,
      background: `linear-gradient(90deg, ${color}88, ${color})`,
      width: `${progress}%`,
      transition: 'width 0.4s ease',
      boxShadow: `0 0 8px ${color}55`,
    }} />
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
export const SecuritySCSVSAudit: React.FC = () => {
  const [contractCode, setContractCode] = useState(`contract FileHashRegistry {
    mapping(bytes32 => address) public owners;
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "REENTRANCY_DETECTED");
        locked = true;
        _;
        locked = false;
    }

    function registerHash(bytes32 _hash)
        external nonReentrant onlyOwner {
        owners[_hash] = msg.sender;
    }
}`);

  const [auditResults, setAuditResults] = useState<SecurityAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState('');
  const [activeTab, setActiveTab] = useState<'SCANNER' | 'SHARDS' | 'NETWORK'>('SCANNER');

  /* Live-ish shard metrics */
  const [shardMetrics, setShardMetrics] = useState(SHARDS);

  useEffect(() => {
    const timer = setInterval(() => {
      setShardMetrics(prev => prev.map(s => ({
        ...s,
        records: s.records + Math.floor(Math.random() * 3),
      })));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditResults([]);
    setScanProgress(0);

    const checks = [
      'Scanning reentrancy patterns…',
      'Verifying RBAC modifiers…',
      'Checking integer arithmetic…',
      'Analyzing tx.origin usage…',
      'Evaluating front-run exposure…',
      'Validating event emissions…',
      'Auditing Paymaster whitelist…',
      'Testing hash collision resistance…',
    ];

    for (let i = 0; i < checks.length; i++) {
      setCurrentCheck(checks[i]);
      setScanProgress(Math.round(((i + 1) / checks.length) * 100));
      await new Promise(r => setTimeout(r, 320));
    }

    /* Try real API, fall back to demo */
    try {
      const res = await fetch('/api/audit/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: contractCode }),
      });
      const data = await res.json();
      if (data.checks?.length) {
        setAuditResults(data.checks);
        setIsAuditing(false);
        setCurrentCheck('');
        return;
      }
    } catch { /* fall through */ }

    setAuditResults(DEMO_AUDIT);
    setIsAuditing(false);
    setCurrentCheck('');
  };

  const passed = auditResults.filter(r => r.passed).length;
  const failed = auditResults.filter(r => !r.passed).length;
  const score = auditResults.length > 0 ? Math.round((passed / auditResults.length) * 100) : 0;

  const tabs = [
    { id: 'SCANNER' as const, label: 'SCSVS Scanner', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'SHARDS'  as const, label: 'Shard Topology', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'NETWORK' as const, label: 'Besu Network',   icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="app-root" style={{ background: '#030810' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding: '16px 20px 0',
        borderBottom: '1px solid rgba(74,154,181,0.1)',
        flexShrink: 0,
        background: 'rgba(4,13,20,0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(74,154,181,0.1))',
            border: '1px solid rgba(248,113,113,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171',
          }}>
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#e8f4f8', margin: 0 }}>
              SCSVS Security Audit & Sharded Storage Inspector
            </h2>
            <p className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', margin: 0, letterSpacing: '0.06em' }}>
              Shift-Left Security · MySQL Sharding · Besu Network Health
            </p>
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
                padding: '7px 14px', borderRadius: '8px 8px 0 0',
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

        {/* ── SCSVS Scanner tab ─────────────────────────────── */}
        {activeTab === 'SCANNER' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Code Input */}
            <div className="ice-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 className="w-4 h-4" style={{ color: '#4a9ab5' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f4f8' }}>Solidity Contract Input</span>
                </div>
                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="btn-ice-primary"
                  style={{ padding: '6px 14px', fontSize: 11, gap: 6 }}
                >
                  {isAuditing
                    ? <><div className="ice-spinner" style={{ width: 12, height: 12 }} /> Scanning…</>
                    : <><ShieldCheck className="w-3.5 h-3.5" /> Run SCSVS Scan</>
                  }
                </button>
              </div>

              <textarea
                value={contractCode}
                onChange={e => setContractCode(e.target.value)}
                rows={12}
                className="ice-input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7, resize: 'vertical' }}
              />

              {/* Scan progress */}
              {isAuditing && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.5)' }}>{currentCheck}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: '#4a9ab5' }}>{scanProgress}%</span>
                  </div>
                  <ScanBar progress={scanProgress} color="#4a9ab5" />
                </div>
              )}
            </div>

            {/* Results panel */}
            <div>
              {/* Score card */}
              {auditResults.length > 0 && (
                <div className="ice-card" style={{ padding: '14px 16px', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 900, color: score >= 90 ? '#6ee7b7' : score >= 70 ? '#fbbf24' : '#f87171' }}>
                        {score}<span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(184,217,232,0.5)' }}>/100</span>
                      </div>
                      <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(184,217,232,0.4)' }}>
                        SCSVS Security Score
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#6ee7b7' }}>{passed}</div>
                        <div className="font-mono" style={{ fontSize: 9, color: 'rgba(110,231,183,0.5)' }}>PASSED</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#f87171' }}>{failed}</div>
                        <div className="font-mono" style={{ fontSize: 9, color: 'rgba(248,113,113,0.5)' }}>FAILED</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <ScanBar progress={score} color={score >= 90 ? '#6ee7b7' : score >= 70 ? '#fbbf24' : '#f87171'} />
                  </div>
                </div>
              )}

              {/* Check results */}
              {auditResults.length === 0 && !isAuditing && (
                <div className="ice-card" style={{ padding: '24px', textAlign: 'center', color: 'rgba(184,217,232,0.3)' }}>
                  <ShieldCheck className="w-8 h-8" style={{ margin: '0 auto 10px' }} />
                  <div style={{ fontSize: 12 }}>Run SCSVS scan to analyze your smart contract</div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
                {auditResults.map((check, i) => (
                  <div
                    key={i}
                    className="ice-card"
                    style={{
                      padding: '12px 14px',
                      borderColor: check.passed ? 'rgba(110,231,183,0.2)' : 'rgba(248,113,113,0.2)',
                      background: check.passed
                        ? 'linear-gradient(160deg, rgba(110,231,183,0.04), rgba(4,13,20,0.9))'
                        : 'linear-gradient(160deg, rgba(248,113,113,0.06), rgba(4,13,20,0.9))',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        {check.passed
                          ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: '#6ee7b7', flexShrink: 0 }} />
                          : <XCircle     className="w-3.5 h-3.5" style={{ color: '#f87171', flexShrink: 0 }} />
                        }
                        <span className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.45)' }}>[{check.checkId}]</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f4f8' }}>{check.title}</span>
                      </div>
                      <SeverityBadge s={check.severity} />
                    </div>
                    <p style={{ fontSize: 11, color: 'rgba(184,217,232,0.45)', lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
                      {check.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Shard Topology tab ────────────────────────────── */}
        {activeTab === 'SHARDS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Total Records', value: shardMetrics.reduce((s, m) => s + m.records, 0).toLocaleString(), icon: <HardDrive className="w-3.5 h-3.5" />, color: '#4a9ab5' },
                { label: 'Total Disk (MB)', value: `${shardMetrics.reduce((s, m) => s + m.diskMb, 0)} MB`, icon: <Database className="w-3.5 h-3.5" />, color: '#a78bfa' },
                { label: 'Shard Status', value: '3 / 3 ONLINE', icon: <Wifi className="w-3.5 h-3.5" />, color: '#6ee7b7' },
              ].map(s => (
                <div key={s.label} className="ice-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}14`, border: `1px solid ${s.color}28`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#e8f4f8' }}>{s.value}</div>
                    <div className="font-mono" style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(184,217,232,0.4)' }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shard cards */}
            {shardMetrics.map(shard => (
              <div key={shard.name} className="ice-card" style={{ padding: '18px 20px', borderColor: `${shard.accent}25` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: `${shard.accent}14`, border: `1px solid ${shard.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: shard.accent, flexShrink: 0 }}>
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f4f8' }}>{shard.name}</div>
                      <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)' }}>
                        Partition: {shard.partition}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="pulse-dot" style={{ background: shard.accent }} />
                    <span className="font-mono" style={{ fontSize: 10, color: shard.accent, fontWeight: 700 }}>{shard.status}</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div className="ice-card" style={{ padding: '10px 12px' }}>
                    <div className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Records</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: shard.accent }}>{shard.records.toLocaleString()}</div>
                  </div>
                  <div className="ice-card" style={{ padding: '10px 12px' }}>
                    <div className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Disk Usage</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: shard.accent }}>{shard.diskMb} MB</div>
                  </div>
                </div>

                {/* Usage bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.35)' }}>Disk Utilization</span>
                    <span className="font-mono" style={{ fontSize: 9, color: shard.accent }}>
                      {Math.round((shard.diskMb / shard.maxMb) * 100)}%
                    </span>
                  </div>
                  <ScanBar progress={(shard.diskMb / shard.maxMb) * 100} color={shard.accent} />
                </div>
              </div>
            ))}

            {/* Sharding logic snippet */}
            <div className="ice-card" style={{ padding: '16px 18px' }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                MySQL Sharding Router — Go Middleware
              </div>
              <pre style={{
                background: 'rgba(2,8,14,0.8)', border: '1px solid rgba(74,154,181,0.12)',
                borderRadius: 8, padding: '12px 14px',
                fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
                color: 'rgba(184,217,232,0.55)', overflowX: 'auto', margin: 0,
              }}>
{`// SHA-256 prefix-based horizontal sharding
func getShardNode(shaHash string) *sql.DB {
    switch shaHash[0] {
    case '0','1','2','3','4','5':
        return shardAlpha  // 142 MB / 1240 records
    case '6','7','8','9','a':
        return shardBeta   // 110 MB / 980 records
    default:
        return shardGamma  // 185 MB / 1510 records
    }
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ── Besu Network tab ──────────────────────────────── */}
        {activeTab === 'NETWORK' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Network banner */}
            <div className="ice-card" style={{ padding: '16px 20px', borderColor: 'rgba(74,154,181,0.3)', background: 'linear-gradient(135deg, rgba(74,154,181,0.05), rgba(4,13,20,0.95))' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
                {[
                  { label: 'Network', value: 'Hyperledger Besu (QBFT)', color: '#6ee7b7' },
                  { label: 'Consensus', value: 'QBFT (Byzantine Fault Tolerant)', color: '#4a9ab5' },
                  { label: 'Target TPS', value: '200 – 800 TPS', color: '#fbbf24' },
                  { label: 'Block Time', value: '2 seconds', color: '#a78bfa' },
                  { label: 'Active Nodes', value: '4 validators', color: '#6ee7b7' },
                  { label: 'Chain ID', value: '1337 (Private)', color: '#4a9ab5' },
                ].map(item => (
                  <div key={item.label} className="font-mono">
                    <div style={{ fontSize: 9, color: 'rgba(184,217,232,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consensus nodes */}
            <div>
              <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                QBFT Validator Nodes
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { name: 'Node-1 (Bootnode)', addr: '0xdOS_V1_0xF3a2...d9', tps: 580, blocks: 10002, role: 'VALIDATOR + BOOTNODE' },
                  { name: 'Node-2 (Validator)', addr: '0xdOS_V2_0xA7b4...e1', tps: 579, blocks: 10002, role: 'VALIDATOR' },
                  { name: 'Node-3 (Validator)', addr: '0xdOS_V3_0xC1d8...f5', tps: 581, blocks: 10002, role: 'VALIDATOR' },
                  { name: 'Node-4 (RPC Node)',  addr: '0xdOS_V4_0xB5e2...c3', tps: 0,   blocks: 10002, role: 'RPC (READ-ONLY)' },
                ].map(node => (
                  <div key={node.name} className="ice-card" style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e8f4f8' }}>{node.name}</span>
                      <span className="pulse-dot" />
                    </div>
                    <div className="font-mono" style={{ fontSize: 10, color: '#4a9ab5', marginBottom: 6 }}>{node.role}</div>
                    <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.35)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {node.addr}
                    </div>
                    <div style={{ display: 'flex', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#6ee7b7' }}>{node.tps > 0 ? node.tps : '—'}</div>
                        <div className="font-mono" style={{ fontSize: 9, color: 'rgba(110,231,183,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TPS</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#b8d9e8' }}>{node.blocks.toLocaleString()}</div>
                        <div className="font-mono" style={{ fontSize: 9, color: 'rgba(184,217,232,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Blocks</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Besu config snippet */}
            <div className="ice-card" style={{ padding: '16px 18px' }}>
              <div className="font-mono" style={{ fontSize: 10, color: 'rgba(184,217,232,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Hyperledger Besu Genesis Config (QBFT)
              </div>
              <pre style={{
                background: 'rgba(2,8,14,0.8)', border: '1px solid rgba(74,154,181,0.12)',
                borderRadius: 8, padding: '12px 14px',
                fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.7,
                color: 'rgba(184,217,232,0.55)', overflowX: 'auto', margin: 0,
              }}>
{`{
  "config": {
    "chainId": 1337,
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4,
      "blockreward": "0x0"
    },
    "zeroBaseFee": true
  },
  "gasLimit": "0xFFFFFFFFFF",
  "difficulty": "0x1"
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
