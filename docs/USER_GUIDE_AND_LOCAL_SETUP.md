# Decentralized Enterprise Workspace (dOS) - User Guide & Local Setup Manual

**Author**: Shashank Sharma (MCA Semester 3)  
**Project**: Decentralized Enterprise Workspace (dOS)  
**Target Repository**: `https://github.com/ShashankSharmabad122/IOS_SHASHANK-update.git`  

---

## Executive Summary & System Overview

**dOS (Decentralized Enterprise Workspace)** is a Zero-Trust, Blockchain-Powered Web-based Operating System engineered for secure enterprise document vault storage, data integrity verification, and automated project budget escrow management.

Modern enterprise environments frequently face high friction when adopting Web3 technology due to complex crypto wallet setups, seed phrase management, and fluctuating transaction gas fees. Furthermore, public blockchains expose sensitive payload data to privacy risks. 

dOS bridges the Web2 user experience with Web3 zero-trust security by combining:
1. **ERC-4337 Account Abstraction**: Passkey-based WebAuthn hardware authentication, session keys, and 100% gasless transaction sponsorship via a dedicated Smart Account Paymaster.
2. **RSA-2048 & AES-256-GCM Hybrid Cryptography**: AES-256-GCM encrypts document contents, server RSA-2048 wraps AES secret keys, and immutable 32-byte SHA-256 hash fingerprints are registered on-chain.
3. **Hyperledger Besu (QBFT Consensus)**: Private EVM ledger providing 200–800 TPS throughput and 2-second block finality.
4. **MySQL Database Sharding**: Encrypted payloads are partitioned off-chain across `Shard-Alpha`, `Shard-Beta`, and `Shard-Gamma` storage nodes based on SHA-256 hash prefixes.

---

## System Architecture Diagram

```
                                  +---------------------------------------+
                                  |    dOS Enterprise Web Interface       |
                                  |  (HTML5, Tailwind, React, TypeScript) |
                                  +-------------------+-------------------+
                                                      |
                                                      v REST API
                                  +-------------------+-------------------+
                                  |         Go Middleware Gateway         |
                                  |     (RSA-AES Crypto & RPC Bindings)   |
                                  +---------+-------------------+---------+
                                            |                   |
                     Off-Chain Payload      |                   | On-Chain Hash Registry
                                            v                   v
            +-------------------------------+---+   +-----------+-----------------------+
            |  MySQL Sharded Database Engine    |   |  Hyperledger Besu (QBFT Ledger)   |
            |  - Shard-Alpha (Hashes 0-5)       |   |  - UserRoleAccess.sol             |
            |  - Shard-Beta  (Hashes 6-a)       |   |  - FileHashRegistry.sol           |
            |  - Shard-Gamma (Hashes b-f)       |   |  - ProjectMilestones.sol          |
            +-----------------------------------+   +-----------------------------------+
```

---

## Step-by-Step User Operating Workflow

```
[1. Passkey Sign-In] ➔ [2. RSA-AES File Upload] ➔ [3. Verify & Tamper Test] ➔ [4. Escrow Milestones]
```

### Step 1: Sign in with Smart Account (ERC-4337 Passkey Auth)
1. Open your web browser and navigate to `http://localhost:3000`.
2. On the **dOS Lock Screen**, click **Sign In with Hardware Passkey**.
3. The system triggers WebAuthn passkey verification, validates the ERC-4337 UserOp signature, connects your Smart Account (`0xShashank...`), and binds the Paymaster gas tank.
4. You are granted access to the desktop environment. You can lock your session at any time via the top navbar profile menu (**Lock Smart Account**).

### Step 2: Upload & Encrypt Confidential Documents
1. Launch the **RSA-AES File Vault** app from the desktop icon or top navigation bar.
2. Drag and drop any local file (`.txt`, `.pdf`, `.png`, `.jpg`, `.json`, `.csv`) into the designated dropzone, or click to choose a file from your file picker.
3. Toggle **Tessera Private Transaction (Besu)** if private node isolation is required.
4. Click **Encrypt RSA-AES & Register on Ledger**:
   - **Step 1**: Retrieves the server RSA-2048 public key.
   - **Step 2**: Generates a cryptographically secure AES-256 key and IV.
   - **Step 3**: Encrypts the payload with AES-256-GCM cipher.
   - **Step 4**: Encrypts/wraps the AES key using the RSA public key.
   - **Step 5**: Computes the 32-byte SHA-256 hash fingerprint and submits an ERC-4337 Paymaster-sponsored `registerFileHash()` transaction to Hyperledger Besu.
   - **Step 6**: Saves the encrypted payload in the appropriate MySQL DB Shard based on hash prefix (`Shard-Alpha`, `Shard-Beta`, or `Shard-Gamma`).

### Step 3: Decrypt & Test Off-Chain Tamper Detection
1. Select any document from the **Encrypted Vault Items** panel on the left.
2. Click **Decrypt & Verify Integrity**:
   - Decrypts the AES secret key using the server's RSA private key.
   - Decrypts the payload buffer and recalculates its live SHA-256 hash fingerprint.
   - Cross-references the recalculated hash against the immutable Hyperledger Besu blockchain record.
   - Displays green **Integrity Verified** status and renders the decrypted text or image preview natively.
3. Click **Simulate Off-Chain Tamper**:
   - Intentionally corrupts the off-chain MySQL sharded database payload.
   - When attempting to decrypt, the system detects a mismatch between the altered database payload and the immutable blockchain ledger fingerprint, displaying a red **Tampered Data Alert**.

### Step 4: Manage Milestone Escrows & Budget Releases
1. Launch the **Project Milestones** app.
2. View active project phases, allocated ETH budgets, and assignee roles.
3. Assignees submit completion proof hashes (`submitProof`).
4. Authorized auditors review and approve milestone proofs (`approveMilestone`). Upon reaching required verifier approvals (or admin approval), escrow funds transition to `RELEASED`.

### Step 5: Inspect Hyperledger Besu Nodes & Security Audits
1. Open **Solidity Studio & Besu** to view live block finality, transaction counts, validator node status, and inspect compiled contract ABIs.
2. Open **SCSVS Audit & Sharding** to view compliance scans against the **Smart Contract Security Verification Standard (SCSVS v2.0)**.

---

## Comprehensive Local Setup Guide

Follow these steps to configure, compile, test, and run dOS on your local machine.

### Prerequisites & Prerequisites Check
Before getting started, ensure you have the following installed on your operating system:
- **Node.js**: `v20.x` or `v22.x` (Recommended: `v22.11.0` or higher)
- **npm**: `v10.x` or higher
- **Git**: Installed and configured

Verify installation by running:
```bash
node -v
npm -v
git --version
```

---

### Step 1: Clone the Repository & Navigate to Workspace Directory
Open your terminal (macOS/Linux) or PowerShell (Windows) and execute:

```bash
git clone https://github.com/ShashankSharmabad122/IOS_SHASHANK-update.git
cd dos---decentralized-enterprise-workspace
```

---

### Step 2: Install Application Dependencies
Install all required Node modules and dev dependencies:

```bash
npm install
```

---

### Step 3: Compile Smart Contracts
Compile the production Solidity 0.8.24 smart contracts (`UserRoleAccess.sol`, `FileHashRegistry.sol`, `ProjectMilestones.sol`, `SmartAccountPaymaster.sol`) using Hardhat:

```bash
npx hardhat compile
```

*Expected Output:*
```text
Compiled 4 Solidity files successfully (evm target: paris).
```

---

### Step 4: Execute Automated Smart Contract Unit Test Suite
Execute the full TypeScript/CommonJS smart contract test suite to verify role access control, hash registrations, batching, revocation, and milestone escrow logic:

```bash
npx hardhat run scripts/test-contracts.cjs
```

*Expected Output:*
```text
========================================================================
      dOS Phase 2 Smart Contracts Test Suite Execution Report           
========================================================================

[+] Test Accounts Initialized:
    - Default Admin : 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    - Auditor       : 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    - Normal User   : 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    - Assignee      : 0x90F79bf6EB2c4f870365E785982E1f101E93b906

--- [1/3] Testing UserRoleAccess.sol (Zero-Trust RBAC) ---
✔ UserRoleAccess deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✔ Default Admin has DEFAULT_ADMIN_ROLE: true
✔ Granted AUDITOR_ROLE to 0x70997970C51812dc3A010C7d01b50e0d17dc79C8: true
✔ Granted USER_ROLE to 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC: true
✔ Unauthorized grantRole correctly reverted

--- [2/3] Testing FileHashRegistry.sol (SHA-256 File Integrity) ---
✔ FileHashRegistry deployed at: 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
✔ registerFileHash executed successfully
✔ Batch registration completed for 3 items
✔ Audit completed. Total Audit Count: 1
✔ Revocation verified on ledger
✔ Unauthorized revocation correctly blocked by RBAC

--- [3/3] Testing ProjectMilestones.sol (Multi-Sig Escrow) ---
✔ ProjectMilestones deployed at: 0x0165878A594ca255338adfa4d48449f69242Eb8F
✔ Milestone created, proof submitted, approved & RELEASED

========================================================================
       ALL PHASE 2 SMART CONTRACT UNIT TESTS PASSED SUCCESSFULLY!       
========================================================================
```

---

### Step 5: Launch Development Server
Start the local server (Vite frontend + Express backend with node cryptography engine):

```bash
npm run dev
```

*Expected Output:*
```text
dOS Backend Server listening on http://0.0.0.0:3000
```

---

### Step 6: Access the Application
Open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## Project Structure Quick Reference

```text
dos---decentralized-enterprise-workspace/
├── contracts/                        # Production Solidity Smart Contracts
│   ├── UserRoleAccess.sol            # Zero-Trust RBAC Access Control
│   ├── FileHashRegistry.sol          # SHA-256 Document Integrity Ledger
│   ├── ProjectMilestones.sol         # Automated Escrow & Milestone Release
│   └── SmartAccountPaymaster.sol     # ERC-4337 Paymaster Gas Sponsor
├── docs/                             # Academic Reports & Documentation
│   ├── dOS_MCA_Semester_3_Project_Report.md
│   └── USER_GUIDE_AND_LOCAL_SETUP.md
├── scripts/                          # Test Runners & Automation
│   └── test-contracts.cjs            # Hardhat Execution Test Script
├── src/                              # Frontend React + TypeScript UI
│   ├── App.tsx                       # Main OS Shell & Lock Screen
│   ├── components/                   # Desktop, Taskbar, Navbar Components
│   └── components/apps/              # Application Modules (Vault, Auth, etc.)
├── test/                             # Foundry Solidity Test Files (*.t.sol)
├── hardhat.config.cjs                # Hardhat Compiler Configuration
├── server.ts                         # Node Express API & Cryptography Engine
├── package.json                      # NPM Dependencies & Scripts
└── tsconfig.json                     # TypeScript Compiler Options
```

---

## Troubleshooting & Common Questions

1. **Port 3000 is already in use**:
   - Terminate any running Node process occupying port 3000, or edit `PORT = 3000` in `server.ts`.

2. **Hardhat Compiler Errors**:
   - Ensure you are running Node.js 20 or 22 and execute `npm install` prior to running `npx hardhat compile`.

3. **Passkey Sign-In Simulation**:
   - The passkey sign-in simulator uses local WebAuthn state and requires no external hardware key setup for evaluation.
