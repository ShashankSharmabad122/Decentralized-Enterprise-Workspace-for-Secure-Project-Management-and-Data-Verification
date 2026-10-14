# AMITY UNIVERSITY ONLINE
## MCA SEMESTER 3 MINOR PROJECT - EXTENDED ABSTRACT / PROJECT SUMMARY

**Student Name**: SHASHANK SHARMA  
**Enrollment No.**: A9929725002421(el)  
**Program**: Master of Computer Applications (MCA) – Blockchain Technology and Management  
**Course / Subject**: Minor Project / Seminar Evaluation  
**Project Title**: Decentralized Enterprise Workspace for Secure Project Management and Verification  
**Target Repository**: `https://github.com/ShashankSharmabad122/IOS_SHASHANK-update.git`  

---

### Extended Abstract

Modern enterprise operational environments face severe cybersecurity challenges, including centralized single points of failure, vulnerable data repositories, unauthorized document tampering, and high transaction friction during multi-party project collaboration and financial milestone settlements. Traditional Web2 cloud management platforms (e.g., Notion, Google Workspace, Jira) rely on centralized database architectures that expose enterprise intellectual property to unauthorized internal escalation, data breaches, and single-provider downtime.

To solve these foundational enterprise vulnerabilities, this project introduces **dOS (Decentralized Enterprise Workspace)**—a novel, Zero-Trust, enterprise-grade Web3 operating platform designed to bridge Web2 usability with Web3 immutability, auditability, and cryptographic security. Grounded in secondary research across modern distributed systems, enterprise block-ledgers, and applied cryptography, dOS implements a hybrid architecture combining on-chain smart contract verification with off-chain sharded storage.

Key architectural innovations integrated within dOS include:
1. **Zero-Trust Role-Based Access Control (RBAC)**: Implemented via Solidity smart contracts (`UserRoleAccess.sol`), establishing fine-grained admin, auditor, and user permission boundaries.
2. **On-Chain Document Integrity & Revocation**: Developed `FileHashRegistry.sol` to register SHA-256 digital document fingerprints on an enterprise block-ledger (Hyperledger Besu with QBFT consensus). Supports single/batch hash registration and emergency auditor revocation with zero payload exposure on-chain.
3. **Hybrid RSA-2048 & AES-256-GCM Encryption**: Client-side cryptography ensures that all sensitive document payloads are encrypted prior to transmission. AES-256-GCM secures document contents while RSA-2048 encrypts the symmetric AES keys for authorized enterprise recipients.
4. **ERC-4337 Account Abstraction & Paymaster Sponsorship**: Solves the critical Web3 user adoption barrier by replacing complex 24-word seed phrases with WebAuthn Passkeys and session keys. Gas tank Paymaster sponsorship (`SmartAccountPaymaster.sol`) hides blockchain gas mechanics from corporate end-users.
5. **Automated Multi-Signature Escrow**: Integrated `ProjectMilestones.sol` to automate project budget releases upon dual verification by project managers and auditors.
6. **Horizontal Cloud Database Sharding**: Distributed off-chain encrypted payloads across MySQL database shards (`Shard-Alpha`, `Shard-Beta`, `Shard-Gamma`) indexed by SHA-256 hash prefixes to achieve infinite storage scaling without blockchain state bloat.

Comprehensive testing via Foundry and Hardhat test runners demonstrated 100% assertion pass rates across all smart contract state transitions. Furthermore, security auditing against the **Smart Contract Security Verification Standard (SCSVS v2.0)** confirmed zero high-risk vulnerabilities, achieving full compliance across reentrancy protection, access control enforcement, arithmetic safety, and hash integrity checks.

In conclusion, dOS demonstrates that enterprise-grade security and cryptographic integrity can be achieved without compromising user experience, delivering a scalable, tamper-proof, and seamless workspace for modern decentralized organizations.

---
**Keywords**: Blockchain, Hyperledger Besu, Account Abstraction (ERC-4337), Hybrid Cryptography (RSA/AES), Smart Contract Security (SCSVS v2.0), Database Sharding, Zero-Trust Architecture.
