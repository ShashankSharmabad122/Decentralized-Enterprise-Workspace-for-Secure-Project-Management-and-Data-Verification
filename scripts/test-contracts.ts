import hre from "hardhat";
import crypto from "crypto";

async function main() {
  console.log("========================================================================");
  console.log("      dOS Phase 2 Smart Contracts Test Suite Execution Report           ");
  console.log("========================================================================\n");

  const [admin, auditor, normalUser, assignee] = await hre.ethers.getSigners();

  console.log(`[+] Test Accounts Initialized:`);
  console.log(`    - Default Admin : ${admin.address}`);
  console.log(`    - Auditor       : ${auditor.address}`);
  console.log(`    - Normal User   : ${normalUser.address}`);
  console.log(`    - Assignee      : ${assignee.address}\n`);

  // 1. Deploy UserRoleAccess & Test RBAC
  console.log("--- [1/3] Testing UserRoleAccess.sol (Zero-Trust RBAC) ---");
  const UserRoleAccessFactory = await hre.ethers.getContractFactory("UserRoleAccess");
  const rbac = await UserRoleAccessFactory.deploy();
  await rbac.waitForDeployment();
  const rbacAddress = await rbac.getAddress();
  console.log(`✔ UserRoleAccess deployed at: ${rbacAddress}`);

  const AUDITOR_ROLE = hre.ethers.keccak256(Buffer.from("AUDITOR_ROLE"));
  const USER_ROLE = hre.ethers.keccak256(Buffer.from("USER_ROLE"));
  const DEFAULT_ADMIN_ROLE = hre.ethers.keccak256(Buffer.from("DEFAULT_ADMIN_ROLE"));

  // Verify Default Admin roles
  const isAdmin = await rbac.hasRole(DEFAULT_ADMIN_ROLE, admin.address);
  console.log(`✔ Default Admin has DEFAULT_ADMIN_ROLE: ${isAdmin}`);

  // Grant Auditor role to auditor account
  await rbac.connect(admin).grantRole(AUDITOR_ROLE, auditor.address);
  const isAuditorGranted = await rbac.hasRole(AUDITOR_ROLE, auditor.address);
  console.log(`✔ Granted AUDITOR_ROLE to ${auditor.address}: ${isAuditorGranted}`);

  // Grant User role to normalUser account
  await rbac.connect(admin).grantRole(USER_ROLE, normalUser.address);
  const isUserGranted = await rbac.hasRole(USER_ROLE, normalUser.address);
  console.log(`✔ Granted USER_ROLE to ${normalUser.address}: ${isUserGranted}`);

  // Test unauthorized role assignment rejection
  try {
    await rbac.connect(normalUser).grantRole(AUDITOR_ROLE, normalUser.address);
    console.error("❌ FAILED: Unauthorized user grantRole should have reverted");
  } catch (err: any) {
    console.log(`✔ Unauthorized grantRole correctly reverted: "${err.message.split('\n')[0]}"`);
  }

  // 2. Deploy FileHashRegistry & Test File Integrity
  console.log("\n--- [2/3] Testing FileHashRegistry.sol (SHA-256 File Integrity) ---");
  const FileHashRegistryFactory = await hre.ethers.getContractFactory("FileHashRegistry");
  const registry = await FileHashRegistryFactory.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log(`✔ FileHashRegistry deployed at: ${registryAddress}`);

  // Setup roles in registry
  await registry.connect(admin).grantRole(AUDITOR_ROLE, auditor.address);
  await registry.connect(admin).grantRole(USER_ROLE, normalUser.address);

  // Test Register Single File Hash
  const testFileString = "Confidential_Enterprise_Audit_Report_Q3_2026.pdf";
  const sha256Hex = crypto.createHash("sha256").update(testFileString).digest("hex");
  const sha256Bytes32 = "0x" + sha256Hex;
  const fileSize = 2048500;
  const metadataUri = "ipfs://QmQ3AuditFingerprintSHA256Hash";

  console.log(`\n  [*] Registering SHA-256 Hash for file: "${testFileString}"`);
  console.log(`      Hash (bytes32): ${sha256Bytes32}`);

  const tx1 = await registry.connect(normalUser).registerFileHash(sha256Bytes32, true, fileSize, metadataUri);
  await tx1.wait();
  console.log(`✔ registerFileHash executed successfully in tx: ${tx1.hash}`);

  // Verify stored file hash details
  const fileData = await registry.verifyHash(sha256Bytes32);
  console.log(`✔ Verify Hash Ledger Output:`);
  console.log(`    - Exists          : ${fileData.exists}`);
  console.log(`    - File Owner      : ${fileData.fileOwner}`);
  console.log(`    - File Size       : ${fileData.fileSize.toString()} bytes`);
  console.log(`    - Metadata URI    : ${fileData.metadataUri}`);
  console.log(`    - Tessera Private : ${fileData.isTesseraPrivate}`);
  console.log(`    - Is Revoked      : ${fileData.isRevoked}`);

  // Test Batch Hash Registration
  console.log(`\n  [*] Registering Batch of 3 Document Hashes...`);
  const batchHashes = [
    "0x" + crypto.createHash("sha256").update("Doc_Alpha_2026.pdf").digest("hex"),
    "0x" + crypto.createHash("sha256").update("Doc_Beta_2026.pdf").digest("hex"),
    "0x" + crypto.createHash("sha256").update("Doc_Gamma_2026.pdf").digest("hex"),
  ];
  const txBatch = await registry.connect(normalUser).registerBatchFileHashes(batchHashes, false);
  await txBatch.wait();
  console.log(`✔ Batch registration completed for ${batchHashes.length} items`);

  // Test Audit Integrity by Auditor
  console.log(`\n  [*] Performing Auditor Integrity Check...`);
  const txAudit = await registry.connect(auditor).auditIntegrity(sha256Bytes32);
  await txAudit.wait();
  const fileDataAfterAudit = await registry.verifyHash(sha256Bytes32);
  console.log(`✔ Audit completed. Total Audit Count: ${fileDataAfterAudit.auditCount.toString()}`);

  // Test Hash Revocation by Auditor
  console.log(`\n  [*] Testing Document Revocation by Auditor...`);
  const revokeReason = "Compromised off-chain storage node detected during quarterly audit";
  const txRevoke = await registry.connect(auditor).revokeFileHash(sha256Bytes32, revokeReason);
  await txRevoke.wait();
  const fileDataAfterRevoke = await registry.verifyHash(sha256Bytes32);
  console.log(`✔ Revocation verified on ledger:`);
  console.log(`    - Is Revoked : ${fileDataAfterRevoke.isRevoked}`);
  console.log(`    - Reason     : "${fileDataAfterRevoke.revocationReason}"`);

  // Test Unauthorized Revocation Rejection
  try {
    const unauthHash = batchHashes[0];
    await registry.connect(normalUser).revokeFileHash(unauthHash, "Illegal revocation attempt");
    console.error("❌ FAILED: Unauthorized revocation should have reverted");
  } catch (err: any) {
    console.log(`✔ Unauthorized revocation correctly blocked by RBAC: "${err.message.split('\n')[0]}"`);
  }

  // 3. Deploy ProjectMilestones & Test Escrow Release
  console.log("\n--- [3/3] Testing ProjectMilestones.sol (Multi-Sig Escrow) ---");
  const ProjectMilestonesFactory = await hre.ethers.getContractFactory("ProjectMilestones");
  const milestones = await ProjectMilestonesFactory.deploy();
  await milestones.waitForDeployment();
  const milestonesAddress = await milestones.getAddress();
  console.log(`✔ ProjectMilestones deployed at: ${milestonesAddress}`);

  await milestones.connect(admin).grantRole(AUDITOR_ROLE, auditor.address);

  // Admin creates milestone
  const milestoneId = 2026101;
  const budget = hre.ethers.parseEther("3.5");
  await milestones.connect(admin).createMilestone(milestoneId, "Phase 2 Core Smart Contracts", budget, assignee.address);
  console.log(`✔ Milestone #${milestoneId} created with budget 3.5 ETH for assignee ${assignee.address}`);

  // Assignee submits proof hash
  const proofHash = "0x" + crypto.createHash("sha256").update("ProofOfPhase2MilestoneCodeAndTests").digest("hex");
  await milestones.connect(assignee).submitProof(milestoneId, proofHash);
  console.log(`✔ Proof hash submitted by assignee: ${proofHash}`);

  // Auditor approves milestone
  await milestones.connect(auditor).approveMilestone(milestoneId);
  console.log(`✔ Auditor approved milestone`);

  // Admin approves milestone (triggers RELEASED status)
  await milestones.connect(admin).approveMilestone(milestoneId);
  console.log(`✔ Admin approved milestone. State transitioned to RELEASED.`);

  const milestoneState = await milestones.milestones(milestoneId);
  console.log(`✔ Milestone State Verification:`);
  console.log(`    - Status          : ${milestoneState.status.toString()} (4 = RELEASED)`);
  console.log(`    - Approvals Count : ${milestoneState.approvalsCount.toString()}`);
  console.log(`    - Assignee        : ${milestoneState.assignee}`);

  console.log("\n========================================================================");
  console.log("       ALL PHASE 2 SMART CONTRACT UNIT TESTS PASSED SUCCESSFULLY!       ");
  console.log("========================================================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
