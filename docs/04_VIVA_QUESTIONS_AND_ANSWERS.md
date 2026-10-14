# AMITY UNIVERSITY ONLINE
### Directorate of Distance & Online Education (ADDOE)
### Master of Computer Applications (MCA) – Blockchain Technology and Management

---

# PART 2: VIVA-VOCE EXAMINATION PREPARATION GUIDE
## 5 DESCRIPTIVE QUESTIONS WITH DETAILED ANSWERS (6 MARKS EACH | TOTAL: 30 MARKS)

**Student Name**: SHASHANK SHARMA  
**Enrollment Number**: A9929725002421(el)  
**Program**: Master of Computer Applications (MCA) – Blockchain Technology and Management  
**Course / Subject**: Minor Project / Seminar Evaluation (Part 2 Viva)  
**Semester**: 3rd Semester  
**Project Title**: Decentralized Enterprise Workspace for Secure Project Management and Verification  

---

## QUESTION 1 (6 MARKS)
**Explain the architectural design of dOS (Decentralized Enterprise Workspace). How does it combine on-chain blockchain immutability with off-chain sharded storage to achieve both security and high performance?**

### Model Answer:
The architecture of **dOS (Decentralized Enterprise Workspace)** addresses the fundamental Web3 trilemma of balancing security, privacy, and performance by employing a hybrid **on-chain / off-chain decoupled model**.

```
[Enterprise Web Client] ───► [Go Middleware Gateway] 
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
[On-Chain Besu QBFT Ledger]                       [Off-Chain Database Shards]
 - UserRoleAccess.sol                             - Shard-Alpha (Hashes 0-5)
 - FileHashRegistry.sol                           - Shard-Beta  (Hashes 6-a)
 - ProjectMilestones.sol                          - Shard-Gamma (Hashes b-f)
 (32-byte SHA-256 Hash Proofs)                    (AES-256 Encrypted Payload)
```

1. **On-Chain Layer (Immutability & Access Control)**:
   - Built on a private **Hyperledger Besu EVM** ledger operating with **QBFT (Quorum Byzantine Fault Tolerance)** consensus.
   - Solidity smart contracts (`UserRoleAccess.sol`, `FileHashRegistry.sol`, `ProjectMilestones.sol`) execute on-chain.
   - Storing raw enterprise payloads on-chain is prohibitively expensive and violates privacy standards. Therefore, the on-chain ledger exclusively stores 32-byte **SHA-256 cryptographic hash fingerprints**, file size, owner addresses, and revocation flags.
   - On-chain state changes benefit from 2-second deterministic block finality and 200–800 TPS throughput.

2. **Off-Chain Layer (Encrypted Sharded Storage & High Throughput)**:
   - Bulk document payloads are encrypted client-side using **AES-256-GCM** and wrapped with **RSA-2048** before being transmitted off-chain.
   - Encrypted payloads are routed across horizontal **MySQL Database Shards** (`Shard-Alpha`, `Shard-Beta`, `Shard-Gamma`).
   - The Go middleware inspects the first hexadecimal character of the file's SHA-256 hash to route data deterministically (Prefixes `0-5` to Alpha, `6-a` to Beta, `b-f` to Gamma).
   - This design ensures uniform load distribution, sub-10ms query performance, and infinite storage expansion without inflating the on-chain blockchain state.

---

## QUESTION 2 (6 MARKS)
**How does EIP-4337 Account Abstraction solve Web3 onboarding friction in dOS? Describe the roles of WebAuthn Passkeys, Session Keys, and the Smart Account Paymaster.**

### Model Answer:
Traditional Web3 applications require users to manage Externally Owned Accounts (EOAs) protected by 24-word seed phrases and native gas tokens (ETH). This creates severe onboarding friction and security vulnerabilities for corporate employees. **dOS** eliminates these barriers using **ERC-4337 Account Abstraction**:

```
[User Biometrics (Passkey)] ──► [WebAuthn secp256r1] ──► [ERC-4337 UserOperation]
                                                                  │
[Paymaster Gas Tank] ◄─── (Sponsors Gas Fee) ─────────────────────┘
```

1. **WebAuthn Biometric Passkeys**:
   - Replaces seed phrases with hardware-secured Passkeys (FaceID / TouchID / TPM) executing over the `secp256r1` elliptic curve.
   - Private keys remain isolated within the device hardware enclave, rendering phishing and credential theft impossible.

2. **Session Keys**:
   - Allows users to generate temporary, restricted cryptographic keys scoped for specific contract functions (e.g., signing document uploads for 2 hours).
   - Eliminates repetitive pop-up authorization prompts, enabling a fluid, desktop-like user experience.

3. **Smart Account Paymaster (`SmartAccountPaymaster.sol`)**:
   - Implements gas sponsorship logic where the enterprise enterprise account funds a central Paymaster contract pool.
   - When an employee executes a transaction (e.g., registering a document hash or creating a milestone), the Paymaster validates the UserOp and pays the gas fee on behalf of the user.
   - Employees interact with the blockchain completely gaslessly, maintaining seamless enterprise productivity.

---

## QUESTION 3 (6 MARKS)
**Walk through the end-to-end cryptographic pipeline implemented in dOS when an employee uploads a confidential enterprise file. Explain the roles of SHA-256, AES-256-GCM, and RSA-2048.**

### Model Answer:
When an enterprise user uploads a confidential document via `FileExplorerVault.tsx`, dOS executes a zero-trust **Hybrid Asymmetric/Symmetric Cryptographic Pipeline**:

```
[Raw File Payload] ──► 1. SHA-256 Digest ───────────────────────► [32-Byte Hash -> On-Chain]
         │
         ├──► 2. Generate Random 256-Bit AES Key & IV
         │
         ├──► 3. AES-256-GCM Payload Encryption ────────────────► [Encrypted Payload -> Shard Node]
         │
         └──► 4. RSA-2048 Key Wrap (Server Public Key) ──────────► [Wrapped AES Key -> Database Header]
```

1. **Step 1: SHA-256 Hash Computation**:
   - The client computes a 256-bit (32-byte) SHA-256 fingerprint of the unencrypted file. This hash represents the immutable identity of the document for on-chain ledger registration.

2. **Step 2: Symmetric Payload Encryption (AES-256-GCM)**:
   - A cryptographically secure random 256-bit AES secret key and 12-byte Initialization Vector (IV) are generated client-side.
   - The file payload is encrypted using **AES-256-GCM (Galois/Counter Mode)**, producing an encrypted cipher string and an authentication tag that guarantees data authenticity and confidentiality.

3. **Step 3: Asymmetric Key Wrapping (RSA-2048)**:
   - To securely transport the symmetric AES key without exposing it, the client encrypts the 256-bit AES key using the recipient's **RSA-2048 Public Key**.
   - Asymmetric RSA encryption ensures that only the holder of the corresponding RSA Private Key can decrypt the AES key and read the document payload.

4. **Step 4: Decoupled Storage Dispatch**:
   - The 32-byte SHA-256 hash is sent to `FileHashRegistry.sol` on Hyperledger Besu via the Paymaster.
   - The encrypted AES payload and wrapped RSA key are transmitted via REST API to the designated Go middleware and stored in the appropriate MySQL database shard.

---

## QUESTION 4 (6 MARKS)
**Describe the Smart Contract Security Verification Standard (SCSVS v2.0) checks applied to dOS. What specific vulnerabilities were tested, and how were they mitigated in Solidity?**

### Model Answer:
The smart contracts in dOS (`UserRoleAccess.sol`, `FileHashRegistry.sol`, `ProjectMilestones.sol`) were audited against the **OWASP SCSVS v2.0** framework across six critical vulnerability categories, achieving a 100% pass rate:

1. **Access Control & Permission Boundaries (SCSVS-V2.1)**:
   - *Vulnerability*: Unauthorized account calling restricted admin or auditor functions.
   - *Mitigation*: Implemented OpenZeppelin `AccessControl` patterns in `UserRoleAccess.sol`. Custom modifiers `onlyRole(AUDITOR_ROLE)` and `onlyAdmin()` enforce check boundaries, reverting unauthorized calls immediately.

2. **Reentrancy Attacks (SCSVS-V5.3)**:
   - *Vulnerability*: Malicious contracts calling back into milestone escrow functions before internal state updates finish, draining escrow ETH.
   - *Mitigation*: Strictly applied the **Checks-Effects-Interactions (CEI)** design pattern. Internal milestone states (`milestone.status = Status.RELEASED`) and approval counters are updated *before* transferring funds to the assignee address.

3. **Arithmetic Overflows and Underflows (SCSVS-V3.2)**:
   - *Vulnerability*: Legacy integer wrapping bugs altering budget balances or document indices.
   - *Mitigation*: Developed using Solidity `^0.8.24`, which features native built-in overflow/underflow assertion checks that automatically revert transactions on arithmetic overflow.

4. **Hash Integrity & Validation (SCSVS-V4.1)**:
   - *Vulnerability*: Storing zero-byte hashes or overriding existing file records.
   - *Mitigation*: `FileHashRegistry.sol` enforces `require(fileHash != bytes32(0))` and `require(!records[fileHash].exists)` assertions prior to state execution.

5. **Event Emission & Auditability (SCSVS-V1.1)**:
   - *Vulnerability*: Silent state mutations preventing off-chain indexers from detecting document revocations.
   - *Mitigation*: Every state transition emits indexed EVM events (`FileHashRegistered`, `FileHashRevoked`, `MilestoneReleased`), providing transparent audit trails for external monitors.

---

## QUESTION 5 (6 MARKS)
**Explain the workflow of `ProjectMilestones.sol`. How does it govern milestone creation, proof submission, auditor validation, and multi-signature budget releases?**

### Model Answer:
`ProjectMilestones.sol` manages decentralized financial escrows for multi-party enterprise projects using an automated, state-machine-driven multi-signature workflow:

```
[CREATED] ──► (Assignee Submits Proof Hash) ──► [SUBMITTED]
                                                    │
[RELEASED] ◄── (Admin Final Approval) ◄── [AUDITED] ◄── (Auditor Approval)
```

1. **Milestone Creation (`State: CREATED`)**:
   - The project manager executes `createMilestone()` with an assigned employee address, budget amount in ETH, and project metadata URI.
   - The contract lock-allocates the budget ETH inside the contract escrow.

2. **Proof-of-Work Submission (`State: SUBMITTED`)**:
   - Upon completing deliverables, the assigned employee executes `submitProof()` with the SHA-256 hash of the completed work product registered on `FileHashRegistry.sol`.
   - The milestone state transitions to `SUBMITTED`.

3. **Auditor Independent Review (`State: AUDITED`)**:
   - An independent account holding `AUDITOR_ROLE` inspects the off-chain payload and verifies its SHA-256 hash on-chain.
   - The auditor executes `approveMilestone()`. The contract increments `approvalsCount` to 1 and updates the state to `AUDITED`.

4. **Admin Approval & Automated Fund Release (`State: RELEASED`)**:
   - The project administrator executes `approveMilestone()` as the second required signature.
   - The contract verifies `approvalsCount >= 2`, updates `milestone.status = Status.RELEASED`, and transfers the escrowed ETH balance directly to the assignee's address.

This automated multi-signature governance eliminates payment disputes, guarantees auditability, and enforces zero-trust financial discipline across enterprise operations.
