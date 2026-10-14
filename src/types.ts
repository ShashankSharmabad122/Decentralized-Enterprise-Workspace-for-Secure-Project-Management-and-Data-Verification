export interface UserAccount {
  address: string;
  smartAccountId: string;
  role: 'Enterprise Admin' | 'Project Manager' | 'Developer' | 'Auditor';
  sessionKey: string;
  paymasterBalance: string;
  passkeyEnabled: boolean;
  avatar: string;
  name: string;
}

export interface EncryptedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: string;
  ownerAddress: string;
  sha256Hash: string;
  aesEncryptedKey: string;
  encryptedContent: string;
  shardNode: 'Shard-Alpha' | 'Shard-Beta' | 'Shard-Gamma';
  isTampered: boolean;
  blockchainTxHash: string;
  blockNumber: number;
  tesseraPrivate: boolean;
  accessRoles: string[];
}

export interface BlockchainBlock {
  blockNumber: number;
  blockHash: string;
  parentHash: string;
  timestamp: string;
  transactionsCount: number;
  validator: string;
  tps: number;
  consensus: 'QBFT';
  gasUsed: number;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  from: string;
  to: string;
  contractMethod: string;
  sha256Hash?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  timestamp: string;
  gasSponsoredByPaymaster: boolean;
  tesseraEncrypted: boolean;
}

export interface SmartContract {
  id: string;
  name: string;
  filename: string;
  solidityCode: string;
  compiledBytecode: string;
  abi: string;
  deployedAddress: string;
  status: 'Deployed' | 'Draft' | 'Compiling';
  network: 'Hyperledger Besu QBFT';
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  /** ETH amount as a string e.g. "0.85" */
  allocatedBudgetEth: string;
  status:
    | 'CREATED'
    | 'IN_PROGRESS'
    | 'PROOF_SUBMITTED'
    | 'DISPUTED'
    | 'RELEASED';
  proofSha256: string;
  smartContractTx: string;
  assignee: string;
}

export interface SecurityAuditResult {
  checkId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  passed: boolean;
}

export interface SystemMetrics {
  qbftTps: number;
  activeNodes: number;
  totalBlocks: number;
  shardedDbStatus: {
    shardAlpha: { status: 'ONLINE'; records: number; diskUsageMb: number };
    shardBeta: { status: 'ONLINE'; records: number; diskUsageMb: number };
    shardGamma: { status: 'ONLINE'; records: number; diskUsageMb: number };
  };
  paymasterGasBalance: number;
  activeSessionKeys: number;
}
