import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Lock,
  Terminal,
  CheckCircle2,
  Server,
  Cloud,
  Code2,
  Zap,
  Play,
  Key,
  FileText,
  Activity,
  Award,
} from "lucide-react";

export const ArchitectureVisualizer: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<number>(0);
  const [simStep, setSimStep] = useState<number>(0);
  const [simInput, setSimInput] = useState<string>("Confidential_MCA_Sem3_Project_Data_2026.pdf");
  const [isSimulating, setIsSimulating] = useState(false);

  const subjects = [
    {
      title: "1. Cryptography & Network Security",
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      features: [
        "RSA-AES Hybrid Encryption: AES-256 for high-speed file encryption + RSA-2048 for key distribution.",
        "SHA-256 Data Integrity: Generates immutable checksums committed directly to Hyperledger Besu ledger.",
        "Zero Trust Model: Strict RBAC authorization policies for all file explorer requests.",
      ],
      codeSnippet: `// RSA-AES Hybrid Key Wrapping
const aesKey = crypto.randomBytes(32);
const encryptedAesKey = crypto.publicEncrypt(rsaPublicKey, aesKey);
const sha256Checksum = crypto.createHash("sha256").update(fileBytes).digest("hex");`,
    },
    {
      title: "2. Blockchain Tech & Smart Contracts",
      icon: <ShieldCheck className="w-4 h-4 text-indigo-400" />,
      features: [
        "Account Abstraction (ERC-4337): Passkey & session-key logins with Paymaster sponsored gas fees.",
        "File Hash Registry Contract: Solidity smart contract registering SHA-256 fingerprints.",
        "Project Milestones Contract: Automatic escrow release on milestone proof verification.",
      ],
      codeSnippet: `// FileHashRegistry.sol
contract FileHashRegistry {
    event HashRegistered(bytes32 indexed shaHash, address owner, uint256 timestamp);
    function registerHash(bytes32 _hash) external {
        hashes[_hash] = FileRecord(msg.sender, block.timestamp);
        emit HashRegistered(_hash, msg.sender, block.timestamp);
    }
}`,
    },
    {
      title: "3. Enterprise Blockchain (Hyperledger Besu)",
      icon: <Server className="w-4 h-4 text-amber-400" />,
      features: [
        "QBFT Consensus: Deterministic finality with 200-800 TPS & 2-second block intervals.",
        "Tessera Private Transactions: Off-chain encrypted payloads for enterprise confidentiality.",
        "Zero-Gas Private Network: Enterprise nodes with custom gas price policy.",
      ],
      codeSnippet: `// besu-config.json
"genesis": {
  "config": {
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4
    }
  }
}`,
    },
    {
      title: "4. Programming Languages (Solidity & Go)",
      icon: <Code2 className="w-4 h-4 text-sky-400" />,
      features: [
        "Golang Middleware: High-concurrency REST gateway powering dOS OS requests.",
        "go-ethereum (abigen): Native Go bindings generated directly from compiled Solidity ABI.",
        "Goroutines: Concurrent transaction batching to Besu node RPC.",
      ],
      codeSnippet: `// main.go binding execution
instance, err := contracts.NewFileHashRegistry(contractAddr, client)
tx, err := instance.RegisterHash(auth, shaBytes)`,
    },
    {
      title: "5. Web3 SDLC & Security Auditing",
      icon: <Award className="w-4 h-4 text-rose-400" />,
      features: [
        "Foundry & Hardhat Workflow: Fast native Solidity unit testing, fuzzing, and coverage.",
        "Shift-Left Security: Continuous SCSVS compliance scans during development.",
        "Reentrancy Protection: Mutex guards & Checks-Effects-Interactions pattern.",
      ],
      codeSnippet: `// Foundry Test
function test_FileRegistration() public {
    bytes32 testHash = keccak256("testData");
    registry.registerHash(testHash);
    assertEq(registry.getOwner(testHash), address(this));
}`,
    },
    {
      title: "6. Cloud Computing & Distributed Databases",
      icon: <Database className="w-4 h-4 text-purple-400" />,
      features: [
        "MySQL Database Sharding: Horizontal partition across Shard-Alpha, Shard-Beta, Shard-Gamma.",
        "Off-Chain Payload Storage: Store heavy encrypted assets in sharded DB; hashes on-chain.",
        "Green Cloud Computing: Optimized resource utilization & QBFT low-power consensus.",
      ],
      codeSnippet: `// MySQL Sharding Key Selector
func getShardNode(shaHash string) string {
    switch shaHash[0] {
    case '0','1','2','3','4','5': return "Shard-Alpha"
    case '6','7','8','9','a':     return "Shard-Beta"
    default:                      return "Shard-Gamma"
    }
}`,
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1000);
    setTimeout(() => setSimStep(3), 2000);
    setTimeout(() => setSimStep(4), 3000);
    setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
    }, 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Layers className="w-64 h-64 text-indigo-400" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold">
              MCA Semester 3 Minor Project
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono px-2.5 py-0.5 rounded-full">
              Phase 1 Architecture Blueprint
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            dOS: Decentralized Enterprise Workspace Architecture
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Elevating "Shashank OS" into a Zero-Trust, Blockchain-Powered Enterprise Workspace using RSA-AES Hybrid Cryptography, Hyperledger Besu (QBFT), ERC-4337 Smart Accounts, and MySQL Database Sharding.
          </p>
        </div>
      </div>

      {/* High Level 4-Layer Architecture Topology Diagram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>1. High-Level Enterprise System Topology</span>
          </h2>
          <span className="text-xs text-slate-400">Interactive End-to-End Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Layer 1: Presentation */}
          <div className="bg-slate-900/90 border border-blue-500/40 rounded-xl p-4 space-y-3 shadow-lg relative group hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-400 font-mono">
                LAYER 1
              </span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Presentation Layer</h3>
            <p className="text-xs text-slate-400">
              Shashank OS Web Interface (HTML5, Tailwind, React, TypeScript)
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded border border-slate-800">
              <li>• File Explorer & RSA Vault UI</li>
              <li>• ERC-4337 Smart Account Login</li>
              <li>• Contract Studio & Milestone App</li>
            </ul>
          </div>

          {/* Layer 2: Middleware */}
          <div className="bg-slate-900/90 border border-sky-500/40 rounded-xl p-4 space-y-3 shadow-lg relative group hover:border-sky-400 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-sky-400 font-mono">
                LAYER 2
              </span>
              <Server className="w-4 h-4 text-sky-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Middleware Layer</h3>
            <p className="text-xs text-slate-400">
              Go / Express REST Gateway & Contract Abigen Bindings
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded border border-slate-800">
              <li>• RSA-2048 Key Wrapper</li>
              <li>• AES-256 GCM Payload Encryptor</li>
              <li>• go-ethereum / RPC Connector</li>
            </ul>
          </div>

          {/* Layer 3: Consensus */}
          <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-4 space-y-3 shadow-lg relative group hover:border-indigo-400 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 font-mono">
                LAYER 3
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Consensus & Blockchain</h3>
            <p className="text-xs text-slate-400">
              Hyperledger Besu (QBFT Consensus & Tessera Private Manager)
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded border border-slate-800">
              <li>• SHA-256 FileHashRegistry.sol</li>
              <li>• ProjectMilestones.sol Escrow</li>
              <li>• 200-800 TPS QBFT Finality</li>
            </ul>
          </div>

          {/* Layer 4: Storage */}
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl p-4 space-y-3 shadow-lg relative group hover:border-purple-400 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-purple-400 font-mono">
                LAYER 4
              </span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="font-bold text-slate-100 text-sm">Off-Chain Storage</h3>
            <p className="text-xs text-slate-400">
              MySQL Sharded Partition Database Engine
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded border border-slate-800">
              <li>• Shard-Alpha (Hashes 0-5)</li>
              <li>• Shard-Beta (Hashes 6-a)</li>
              <li>• Shard-Gamma (Hashes b-f)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Payload Processing Trace Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
            <h2 className="text-base font-bold text-white">
              2. Live End-to-End Payload Trace Simulator
            </h2>
          </div>
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? "Executing Pipeline..." : "Run Pipeline Trace"}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            value={simInput}
            onChange={(e) => setSimInput(e.target.value)}
            placeholder="Enter file payload name..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Pipeline Step Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          <div
            className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
              simStep >= 1
                ? "bg-blue-950/80 border-blue-500 text-blue-200 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-500"
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Step 1: Frontend</span>
              {simStep >= 1 && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
            </div>
            <p className="text-[10px]">User initiates save in dOS File Explorer.</p>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
              simStep >= 2
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-500"
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Step 2: RSA-AES</span>
              {simStep >= 2 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[10px]">AES payload key wrapped with RSA-2048 & SHA-256.</p>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
              simStep >= 3
                ? "bg-purple-950/80 border-purple-500 text-purple-200 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-500"
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Step 3: Shard DB</span>
              {simStep >= 3 && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
            </div>
            <p className="text-[10px]">Encrypted file saved to MySQL Shard-Alpha.</p>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
              simStep >= 4
                ? "bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-500"
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Step 4: Besu QBFT</span>
              {simStep >= 4 && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
            </div>
            <p className="text-[10px]">SHA-256 hash committed to EVM smart contract.</p>
          </div>

          <div
            className={`p-3 rounded-lg border text-xs space-y-1 transition-all ${
              simStep >= 5
                ? "bg-amber-950/80 border-amber-500 text-amber-200 shadow-lg"
                : "bg-slate-950/60 border-slate-800 text-slate-500"
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>Step 5: Verified</span>
              {simStep >= 5 && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <p className="text-[10px]">Tamper-proof block finalized in 2.1s.</p>
          </div>
        </div>
      </div>

      {/* Subject Mapping Matrix for MCA Semester 3 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <BookOpenIcon className="w-5 h-5 text-indigo-400" />
          <span>3. Course Subject Mapping to dOS Codebase</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Navigation List */}
          <div className="space-y-2">
            {subjects.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubject(idx)}
                className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${
                  selectedSubject === idx
                    ? "bg-slate-800 border-indigo-500 text-white font-semibold shadow-md"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {sub.icon}
                  <span>{sub.title}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          {/* Selected Subject Details & Code Snippet */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
              {subjects[selectedSubject].icon}
              <h3 className="font-bold text-white text-base">
                {subjects[selectedSubject].title}
              </h3>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">
                Key Architectural Implementation:
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {subjects[selectedSubject].features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded border border-slate-800">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Code Example / Config snippet:</span>
                <span className="text-indigo-400">dOS Core Repository</span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 text-slate-300 p-3.5 rounded-lg text-xs font-mono overflow-x-auto">
                <code>{subjects[selectedSubject].codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function BookOpenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}
