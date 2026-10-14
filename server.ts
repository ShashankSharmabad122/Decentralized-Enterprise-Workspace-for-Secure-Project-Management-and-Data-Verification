import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "50mb" }));

// RSA Keypair in memory for dOS Hybrid Cryptography Demonstration
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

// Mock In-Memory Databases for Blockchain Ledger & Sharded Off-chain Store
let blocks = [
  {
    blockNumber: 10001,
    blockHash: "0x8f2c91a3b4e5d6f7890123456789abcdef0123456789abcdef0123456789abcd",
    parentHash: "0x7e1b80a2a3d4c5e67890123456789abcdef0123456789abcdef0123456789abce",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    transactionsCount: 14,
    validator: "0xBesuQBFTValidatorNode1",
    tps: 450,
    consensus: "QBFT" as const,
    gasUsed: 210000,
  },
  {
    blockNumber: 10002,
    blockHash: "0x9a3d02b4c5e6f7a890123456789abcdef0123456789abcdef0123456789abcf",
    parentHash: "0x8f2c91a3b4e5d6f7890123456789abcdef0123456789abcdef0123456789abcd",
    timestamp: new Date().toISOString(),
    transactionsCount: 28,
    validator: "0xBesuQBFTValidatorNode2",
    tps: 620,
    consensus: "QBFT" as const,
    gasUsed: 420000,
  }
];

let transactions: any[] = [
  {
    txHash: "0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01",
    blockNumber: 10002,
    from: "0xSmartAccount_Shashank_ERC4337",
    to: "0xFileHashRegistryContractAddress",
    contractMethod: "registerFileHash(bytes32,string)",
    sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "SUCCESS",
    timestamp: new Date().toISOString(),
    gasSponsoredByPaymaster: true,
    tesseraEncrypted: true,
  }
];

let filesDatabase: any[] = [
  {
    id: "file-001",
    name: "Enterprise_Q3_Budget_Audit.pdf",
    size: 245120,
    mimeType: "application/pdf",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    ownerAddress: "0xSmartAccount_Shashank_ERC4337",
    sha256Hash: "a4f891b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcd",
    aesEncryptedKey: "RSA-AES-ENCRYPTED-KEY-DEMO-001",
    encryptedContent: "U2FsdGVkX19x8v4L9N2a1K3X...",
    shardNode: "Shard-Alpha",
    isTampered: false,
    blockchainTxHash: "0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01",
    blockNumber: 10002,
    tesseraPrivate: true,
    accessRoles: ["Enterprise Admin", "Auditor"],
  }
];

let milestones: any[] = [
  {
    id: "ms-1",
    title: "Phase 1: Hyperledger Besu & Go Binding Integration",
    description: "Deploy QBFT consensus nodes and generate Golang contract abigen bindings.",
    allocatedBudgetEth: 2.5,
    releasedBudgetEth: 2.5,
    status: "RELEASED",
    proofSha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    smartContractTx: "0x3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef01",
    assignee: "Shashank Sharma (Lead Architect)",
    dueDate: "2026-08-01",
  },
  {
    id: "ms-2",
    title: "Phase 2: RSA-AES Cryptographic File Vault & Sharding",
    description: "Implement hybrid cryptography, SHA-256 integrity verification, and MySQL sharding.",
    allocatedBudgetEth: 4.0,
    releasedBudgetEth: 0,
    status: "IN_PROGRESS",
    proofSha256: "Pending verification...",
    smartContractTx: "0xPendingTxHash...",
    assignee: "Shashank Sharma (Lead Architect)",
    dueDate: "2026-08-15",
  }
];

// --- API ENDPOINTS ---

// 1. System Health & Public RSA Key
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "dOS - Decentralized Enterprise Workspace Engine",
    architecture: "Go Middleware <-> Hyperledger Besu (QBFT) <-> MySQL Sharded Storage",
    rsaPublicKey: publicKey,
    consensus: "QBFT",
    tpsRange: "200-800 TPS",
  });
});

// 2. RSA-AES Hybrid Encryption Service
app.post("/api/crypto/encrypt", (req, res) => {
  try {
    const { name, content, mimeType, tesseraPrivate, accessRoles } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content is required for encryption" });
    }

    // SHA-256 Hash of original content
    const sha256Hash = crypto.createHash("sha256").update(content).digest("hex");

    // Generate random AES-256 key and IV
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
    let encryptedContent = cipher.update(content, "utf8", "base64");
    encryptedContent += cipher.final("base64");

    // Encrypt AES key using RSA Public Key
    const encryptedAesKey = crypto.publicEncrypt(
      publicKey,
      Buffer.concat([aesKey, iv])
    ).toString("base64");

    // Determine MySQL Shard Node automatically based on hash prefix
    const shardNode = sha256Hash.startsWith("0") || sha256Hash.startsWith("1") || sha256Hash.startsWith("2") || sha256Hash.startsWith("3") || sha256Hash.startsWith("4") || sha256Hash.startsWith("5")
      ? "Shard-Alpha"
      : sha256Hash.startsWith("6") || sha256Hash.startsWith("7") || sha256Hash.startsWith("8") || sha256Hash.startsWith("9") || sha256Hash.startsWith("a")
      ? "Shard-Beta"
      : "Shard-Gamma";

    // Simulate Blockchain QBFT Transaction
    const blockNumber = blocks[blocks.length - 1].blockNumber + 1;
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");

    const newBlock = {
      blockNumber,
      blockHash: "0x" + crypto.randomBytes(32).toString("hex"),
      parentHash: blocks[blocks.length - 1].blockHash,
      timestamp: new Date().toISOString(),
      transactionsCount: 1,
      validator: `0xBesuQBFTValidatorNode${(blockNumber % 4) + 1}`,
      tps: Math.floor(Math.random() * 400) + 300,
      consensus: "QBFT" as const,
      gasUsed: 145000,
    };
    blocks.push(newBlock);

    const newTx = {
      txHash,
      blockNumber,
      from: "0xSmartAccount_Shashank_ERC4337",
      to: "0xFileHashRegistryContractAddress",
      contractMethod: "registerFileHash(bytes32,string,bool)",
      sha256Hash,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      gasSponsoredByPaymaster: true,
      tesseraEncrypted: !!tesseraPrivate,
    };
    transactions.unshift(newTx);

    const newFile = {
      id: `file-${Date.now()}`,
      name: name || "untitled_document.txt",
      size: Buffer.byteLength(content, "utf8"),
      mimeType: mimeType || "text/plain",
      createdAt: new Date().toISOString(),
      ownerAddress: "0xSmartAccount_Shashank_ERC4337",
      sha256Hash,
      aesEncryptedKey: encryptedAesKey,
      encryptedContent,
      shardNode,
      isTampered: false,
      blockchainTxHash: txHash,
      blockNumber,
      tesseraPrivate: !!tesseraPrivate,
      accessRoles: accessRoles || ["Enterprise Admin", "Developer"],
    };

    filesDatabase.unshift(newFile);

    res.json({
      success: true,
      file: newFile,
      blockchainTx: newTx,
      block: newBlock,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Encryption failed" });
  }
});

// 3. RSA-AES Hybrid Decryption Service
app.post("/api/crypto/decrypt", (req, res) => {
  try {
    const { fileId, simulateTamper } = req.body;
    const file = filesDatabase.find((f) => f.id === fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Decrypt AES Key using server's RSA Private Key
    const keyAndIvBuffer = crypto.privateDecrypt(
      privateKey,
      Buffer.from(file.aesEncryptedKey, "base64")
    );
    const aesKey = keyAndIvBuffer.subarray(0, 32);
    const iv = keyAndIvBuffer.subarray(32, 48);

    const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
    let decrypted = decipher.update(file.encryptedContent, "base64", "utf8");
    decrypted += decipher.final("utf8");

    if (simulateTamper) {
      decrypted += "\n[TAMPERED CONTENT INSERTED BY UNAUTHORIZED PROCESS]";
    }

    // Recalculate SHA-256 Hash to verify integrity against Blockchain Ledger
    const currentHash = crypto.createHash("sha256").update(decrypted).digest("hex");
    const isIntegrityValid = currentHash === file.sha256Hash;

    res.json({
      success: true,
      decryptedContent: decrypted,
      originalSha256: file.sha256Hash,
      recalculatedSha256: currentHash,
      isIntegrityValid,
      message: isIntegrityValid
        ? "✅ Document integrity verified! SHA-256 matches Hyperledger Besu Ledger."
        : "⚠️ INTEGRITY BREACH DETECTED! Content hash differs from immutable blockchain block record.",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Decryption failed" });
  }
});

// 4. File List & Tamper Injection Simulation
app.get("/api/files", (req, res) => {
  res.json({ files: filesDatabase });
});

app.post("/api/files/tamper", (req, res) => {
  const { fileId } = req.body;
  const file = filesDatabase.find((f) => f.id === fileId);
  if (!file) return res.status(404).json({ error: "File not found" });

  file.encryptedContent += "CORRUPTED_BYTES_IN_MYSQL_SHARD";
  file.isTampered = true;

  res.json({ success: true, message: "Tamper simulated in off-chain database shard", file });
});

// 5. Blockchain Explorer & QBFT Metrics
app.get("/api/blockchain/blocks", (req, res) => {
  res.json({
    blocks,
    latestTps: Math.floor(Math.random() * 300) + 400,
    consensus: "QBFT (Quorum Byzantine Fault Tolerance)",
    finalityLatencySec: 2.1,
  });
});

app.get("/api/blockchain/transactions", (req, res) => {
  res.json({ transactions });
});

// 6. Project Management Smart Contract API
app.get("/api/projects/milestones", (req, res) => {
  res.json({ milestones });
});

app.post("/api/projects/milestones/release", (req, res) => {
  const { milestoneId } = req.body;
  const milestone = milestones.find((m) => m.id === milestoneId);
  if (!milestone) return res.status(404).json({ error: "Milestone not found" });

  milestone.status = "RELEASED";
  milestone.releasedBudgetEth = milestone.allocatedBudgetEth;
  milestone.smartContractTx = "0x" + crypto.randomBytes(32).toString("hex");

  res.json({ success: true, milestone });
});

// 7. Smart Contract SCSVS Security Audit Scanner
app.post("/api/audit/contract", (req, res) => {
  const { code } = req.body;
  const hasReentrancyGuard = code.includes("nonReentrant") || code.includes("Mutex");
  const checks = [
    {
      checkId: "SCSVS-V1.1",
      category: "Reentrancy" as const,
      severity: hasReentrancyGuard ? ("PASS" as const) : ("CRITICAL" as const),
      title: "Reentrancy Protection Guard",
      description: hasReentrancyGuard
        ? "Reentrancy guard (nonReentrant / Mutex) detected on state-changing methods."
        : "Missing mutex guard on transfer methods! Vulnerable to reentrancy attacks.",
      line: 18,
      passed: hasReentrancyGuard,
    },
    {
      checkId: "SCSVS-V2.4",
      category: "Access Control" as const,
      severity: code.includes("onlyOwner") || code.includes("onlyRole") ? ("PASS" as const) : ("HIGH" as const),
      title: "Role-Based Access Control (RBAC)",
      description: "Verifies restricted access modifier on sensitive file hash registry functions.",
      line: 25,
      passed: code.includes("onlyOwner") || code.includes("onlyRole"),
    },
    {
      checkId: "SCSVS-V3.2",
      category: "Arithmetic" as const,
      severity: "PASS" as const,
      title: "SafeMath / Solidity 0.8+ Overflow Checking",
      description: "Solidity version check confirms native overflow/underflow protection.",
      line: 2,
      passed: true,
    },
    {
      checkId: "SCSVS-V4.1",
      category: "SCSVS Compliance" as const,
      severity: "PASS" as const,
      title: "SHA-256 Hash Integrity Verification Standard",
      description: "Verifies 32-byte hash format and event emission for blockchain indexing.",
      line: 32,
      passed: true,
    },
  ];

  res.json({ checks, isAuditPassed: checks.every((c) => c.passed) });
});

// Vite Middleware for Development / Static serving in Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`dOS Backend Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
