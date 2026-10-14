// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/FileHashRegistry.sol";

contract FileHashRegistryTest is Test {
    FileHashRegistry internal registry;

    address internal admin = address(0xA1);
    address internal auditor = address(0xB2);
    address internal normalUser = address(0xC3);

    function setUp() public {
        vm.startPrank(admin);
        registry = new FileHashRegistry();
        registry.grantRole(registry.AUDITOR_ROLE(), auditor);
        registry.grantRole(registry.USER_ROLE(), normalUser);
        vm.stopPrank();
    }

    function test_RegisterFileHash() public {
        bytes32 testHash = keccak256("Confidential_MCA_Sem3_Project_Data_2026.pdf");
        
        vm.prank(normalUser);
        registry.registerFileHash(testHash, true, 1024500, "ipfs://QmTest123Hash");

        (
            bool exists,
            address owner,
            uint256 timestamp,
            uint256 fileSize,
            string memory metadataUri,
            bool isPrivate,
            bool isRevoked,
            ,
            uint256 auditCount
        ) = registry.verifyHash(testHash);

        assertTrue(exists, "Hash should exist on ledger");
        assertEq(owner, normalUser, "Owner should match normalUser address");
        assertTrue(timestamp > 0, "Timestamp should be non-zero");
        assertEq(fileSize, 1024500, "File size should match");
        assertEq(metadataUri, "ipfs://QmTest123Hash", "Metadata URI should match");
        assertTrue(isPrivate, "Tessera privacy flag should be true");
        assertFalse(isRevoked, "Revocation flag should be false");
        assertEq(auditCount, 0, "Initial audit count should be zero");
    }

    function test_BatchHashRegistration() public {
        bytes32[] memory hashes = new bytes32[](3);
        hashes[0] = keccak256("Doc1.pdf");
        hashes[1] = keccak256("Doc2.pdf");
        hashes[2] = keccak256("Doc3.pdf");

        vm.prank(normalUser);
        registry.registerBatchFileHashes(hashes, false);

        (bool exists1,,,,,,,,) = registry.verifyHash(hashes[0]);
        (bool exists2,,,,,,,,) = registry.verifyHash(hashes[1]);
        (bool exists3,,,,,,,,) = registry.verifyHash(hashes[2]);

        assertTrue(exists1);
        assertTrue(exists2);
        assertTrue(exists3);
    }

    function test_AuditIntegrityByAuditor() public {
        bytes32 testHash = keccak256("AuditDocument.pdf");

        vm.prank(normalUser);
        registry.registerFileHash(testHash, false, 2048, "ipfs://AuditDoc");

        vm.prank(auditor);
        registry.auditIntegrity(testHash);

        (,,,,,,,, uint256 auditCount) = registry.verifyHash(testHash);
        assertEq(auditCount, 1, "Audit count should be 1 after auditor validation");
    }

    function test_RevokeFileHashByAuditor() public {
        bytes32 testHash = keccak256("DocumentToRevoke.docx");

        vm.prank(normalUser);
        registry.registerFileHash(testHash, false, 500, "ipfs://RevokeDoc");

        vm.prank(auditor);
        registry.revokeFileHash(testHash, "Security breach in off-chain storage node");

        (,,,,,, bool isRevoked, string memory reason,) = registry.verifyHash(testHash);
        assertTrue(isRevoked);
        assertEq(reason, "Security breach in off-chain storage node");
    }

    function testRevert_DuplicateHashRegistration() public {
        bytes32 testHash = keccak256("DuplicateDoc.pdf");

        vm.startPrank(normalUser);
        registry.registerFileHash(testHash, false, 100, "uri1");

        vm.expectRevert("FileHashRegistry: File hash already registered on ledger");
        registry.registerFileHash(testHash, false, 100, "uri1");
        vm.stopPrank();
    }

    function testRevert_UnauthorizedRevocation() public {
        bytes32 testHash = keccak256("UnauthorizedRevoke.pdf");

        vm.prank(normalUser);
        registry.registerFileHash(testHash, false, 100, "uri");

        vm.prank(normalUser);
        vm.expectRevert("UserRoleAccess: sender does not have required role");
        registry.revokeFileHash(testHash, "Attempted illegal revocation");
    }

    function testFuzz_RegisterRandomHashes(bytes32 randomHash) public {
        vm.assume(randomHash != bytes32(0));

        vm.prank(normalUser);
        registry.registerFileHash(randomHash, true, 4096, "fuzz_uri");

        (bool exists,,,,,,,,) = registry.verifyHash(randomHash);
        assertTrue(exists);
    }
}
