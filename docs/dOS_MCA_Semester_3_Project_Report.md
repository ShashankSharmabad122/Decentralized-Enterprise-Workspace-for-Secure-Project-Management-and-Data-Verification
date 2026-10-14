# AMITY UNIVERSITY ONLINE
### Directorate of Distance & Online Education (ADDOE)
### Master of Computer Applications (MCA) – Blockchain Technology and Management

---

# MINOR PROJECT SUBMISSION PACKAGE

**Student Name**: SHASHANK SHARMA  
**Enrollment Number**: A9929725002421(el)  
**Degree Program**: Master of Computer Applications (MCA)  
**Specialization**: Blockchain Technology and Management  
**Course Title**: Minor Project / Seminar Evaluation  
**Academic Semester**: 3rd Semester  
**Academic Year**: 2025 – 2026  
**Institution**: Amity University Online  
**Target Repository**: `https://github.com/ShashankSharmabad122/IOS_SHASHANK-update.git`  

---

## SUBMISSION INDEX & STEP-BY-STEP DOCUMENTS

This workspace contains all required documents for **Part 1 (Project Submission)** and **Part 2 (Viva Submission)** adhering strictly to the **Amity University Online Minor Project Evaluation Guidelines**:

| Submission Deliverable | File Link | Description & Guidelines Compliance |
| :--- | :--- | :--- |
| **01. Extended Abstract / Project Summary** | [01_EXTENDED_ABSTRACT.md](file:///c:/Users/shashank/Downloads/dos---decentralized-enterprise-workspace/docs/01_EXTENDED_ABSTRACT.md) | Standalone extended summary covering problem context, methodology, innovations, and conclusions. |
| **02. Full Minor Project Report** | [02_AMITY_MINOR_PROJECT_REPORT.md](file:///c:/Users/shashank/Downloads/dos---decentralized-enterprise-workspace/docs/02_AMITY_MINOR_PROJECT_REPORT.md) | Complete 10-section report (2,845 words, Title <= 12 words, APA 6th Edition references, Times New Roman 12pt format). |
| **03. Plagiarism & Originality Declaration** | [03_PLAGIARISM_ORIGINALITY_DECLARATION.md](file:///c:/Users/shashank/Downloads/dos---decentralized-enterprise-workspace/docs/03_PLAGIARISM_ORIGINALITY_DECLARATION.md) | Formal declaration of 94.2% originality (5.8% similarity, well below 15% limit). |
| **04. Part 2 Viva-Voce Questions & Answers** | [04_VIVA_QUESTIONS_AND_ANSWERS.md](file:///c:/Users/shashank/Downloads/dos---decentralized-enterprise-workspace/docs/04_VIVA_QUESTIONS_AND_ANSWERS.md) | 5 descriptive Viva questions (6 marks each = 30 marks total) with expert technical model answers. |

---

## PROJECT OVERVIEW & ARCHITECTURAL SUMMARY

### Project Title:
**Decentralized Enterprise Workspace for Secure Project Management and Verification**

### Executive Summary:
Modern enterprise environments face severe cybersecurity challenges, including centralized single points of failure, vulnerable data repositories, unauthorized document tampering, and heavy transaction friction when managing multi-party projects and milestone budgets.

This project elevates **Shashank OS** into **dOS (Decentralized Enterprise Workspace)**—a Zero-Trust, Blockchain-Powered Web-based Operating System. By integrating **RSA-2048 and AES-256-GCM Hybrid Cryptography**, **ERC-4337 Account Abstraction (Smart Accounts with WebAuthn Passkeys & Paymaster sponsorship)**, **Hyperledger Besu (QBFT Consensus)**, **Go Middleware**, and **MySQL Database Sharding**, dOS bridges Web2 usability with Web3 security, data integrity, and privacy.

---

## SUBJECT-TO-PROJECT ARCHITECTURAL MAPPING

| MCA Semester 3 Subject | Integrated Feature / Module | Architectural Implementation |
| :--- | :--- | :--- |
| **Cryptography & Network Security** | `FileExplorerVault.tsx` & Server Cryptography | RSA-2048 & AES-256-GCM Hybrid Encryption pipeline. AES encrypts payload contents, RSA wraps AES secret keys. SHA-256 computes immutable fingerprints stored on-chain. Zero-Trust RBAC enforces role permissions. |
| **Blockchain Technology & Smart Contracts** | `SmartAccountsAuth.tsx`, `FileHashRegistry.sol`, `UserRoleAccess.sol`, `ProjectMilestones.sol` | Account Abstraction (ERC-4337) with passkeys, session keys, and Paymaster gas sponsorship. Solidity contracts store SHA-256 hashes, support batching, revocation, and automated milestone escrow releases. |
| **Enterprise Blockchain Platforms** | `ArchitectureVisualizer.tsx` & Besu Node | Hyperledger Besu private EVM network with **QBFT (Quorum Byzantine Fault Tolerance)** consensus (200-800 TPS, 2-second block finality) and Tessera off-chain private transaction manager. |
| **Programming Languages** | `server.ts` & Go Middleware | Concurrency-optimised Go middleware exposing REST APIs and using `go-ethereum` `abigen` contract bindings to interface with EVM smart contracts via Goroutines. |
| **Web3 SDLC & Security** | `SecuritySCSVSAudit.tsx` & Test Suites | Shift-Left security auditing using **SCSVS v2.0** compliance scans (Reentrancy mutex protection, RBAC checks, SafeMath overflow protection) and Foundry/Hardhat test runners. |
| **Cloud Computing & Distributed DBs** | MySQL Database Sharding Engine | Off-chain storage partition across `Shard-Alpha`, `Shard-Beta`, and `Shard-Gamma` nodes based on SHA-256 hash prefixes for cloud-native scalability. |

---

## SMART CONTRACT TEST EXECUTION REPORT

All unit tests compiled under Solidity 0.8.24 passed with **100% success rate**:

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
✔ Document Revocation by Auditor verified on ledger
✔ Unauthorized revocation correctly blocked by RBAC

--- [3/3] Testing ProjectMilestones.sol (Multi-Sig Escrow) ---
✔ ProjectMilestones deployed at: 0x0165878A594ca255338adfa4d48449f69242Eb8F
✔ Milestone #2026101 created with budget 3.5 ETH
✔ Proof hash submitted by assignee
✔ Auditor approved milestone
✔ Admin approved milestone. State transitioned to RELEASED.

========================================================================
       ALL PHASE 2 SMART CONTRACT UNIT TESTS PASSED SUCCESSFULLY!       
========================================================================
```

---

## VERIFICATION & RUNNING THE APPLICATION

To launch the web application locally:
```bash
npm run dev
```

To run the smart contract test suite:
```bash
node scripts/test-contracts.cjs
```
