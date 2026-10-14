// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UserRoleAccess.sol";

/**
 * @title FileHashRegistry
 * @dev Enterprise SHA-256 Document Fingerprint Registry with RBAC, Batching, and Revocation for dOS Workspace
 * @author Shashank Sharma (MCA Semester 3)
 */
contract FileHashRegistry is UserRoleAccess {
    struct FileRecord {
        bytes32 sha256Hash;
        address owner;
        uint256 timestamp;
        uint256 fileSize;
        string metadataUri;
        bool isTesseraPrivate;
        bool isRevoked;
        string revocationReason;
        uint256 auditCount;
    }

    mapping(bytes32 => FileRecord) public records;

    event FileHashRegistered(
        bytes32 indexed sha256Hash,
        address indexed owner,
        bool isTesseraPrivate,
        uint256 fileSize,
        uint256 timestamp
    );
    event BatchHashesRegistered(uint256 totalRegistered, address indexed owner);
    event FileHashRevoked(bytes32 indexed sha256Hash, string reason, address indexed revokedBy);
    event IntegrityAudited(bytes32 indexed sha256Hash, address indexed auditor, uint256 auditTimestamp);

    constructor() UserRoleAccess() {}

    /**
     * @notice Registers a new document SHA-256 fingerprint with enterprise metadata
     */
    function registerFileHash(
        bytes32 _sha256Hash,
        bool _isTesseraPrivate,
        uint256 _fileSize,
        string calldata _metadataUri
    ) public onlyRole(USER_ROLE) {
        require(_sha256Hash != bytes32(0), "FileHashRegistry: Invalid SHA-256 hash");
        require(records[_sha256Hash].timestamp == 0, "FileHashRegistry: File hash already registered on ledger");

        records[_sha256Hash] = FileRecord({
            sha256Hash: _sha256Hash,
            owner: msg.sender,
            timestamp: block.timestamp,
            fileSize: _fileSize,
            metadataUri: _metadataUri,
            isTesseraPrivate: _isTesseraPrivate,
            isRevoked: false,
            revocationReason: "",
            auditCount: 0
        });

        emit FileHashRegistered(_sha256Hash, msg.sender, _isTesseraPrivate, _fileSize, block.timestamp);
    }

    /**
     * @notice Registers multiple file hashes in a single transaction for gas optimization
     */
    function registerBatchFileHashes(bytes32[] calldata _hashes, bool _isTesseraPrivate) external onlyRole(USER_ROLE) {
        uint256 len = _hashes.length;
        require(len > 0, "FileHashRegistry: Batch list cannot be empty");

        uint256 registeredCount = 0;
        for (uint256 i = 0; i < len; i++) {
            if (_hashes[i] != bytes32(0) && records[_hashes[i]].timestamp == 0) {
                records[_hashes[i]] = FileRecord({
                    sha256Hash: _hashes[i],
                    owner: msg.sender,
                    timestamp: block.timestamp,
                    fileSize: 0,
                    metadataUri: "",
                    isTesseraPrivate: _isTesseraPrivate,
                    isRevoked: false,
                    revocationReason: "",
                    auditCount: 0
                });
                registeredCount++;
                emit FileHashRegistered(_hashes[i], msg.sender, _isTesseraPrivate, 0, block.timestamp);
            }
        }

        emit BatchHashesRegistered(registeredCount, msg.sender);
    }

    /**
     * @notice Revokes a previously registered hash (e.g., corrupted or deprecated document)
     */
    function revokeFileHash(bytes32 _sha256Hash, string calldata _reason) external onlyRole(AUDITOR_ROLE) {
        FileRecord storage rec = records[_sha256Hash];
        require(rec.timestamp > 0, "FileHashRegistry: Hash not found");
        require(!rec.isRevoked, "FileHashRegistry: Hash already revoked");

        rec.isRevoked = true;
        rec.revocationReason = _reason;

        emit FileHashRevoked(_sha256Hash, _reason, msg.sender);
    }

    /**
     * @notice Performs formal security/compliance audit on document integrity
     */
    function auditIntegrity(bytes32 _sha256Hash) external onlyRole(AUDITOR_ROLE) {
        FileRecord storage rec = records[_sha256Hash];
        require(rec.timestamp > 0, "FileHashRegistry: Hash not found");
        require(!rec.isRevoked, "FileHashRegistry: Cannot audit revoked hash");

        rec.auditCount++;
        emit IntegrityAudited(_sha256Hash, msg.sender, block.timestamp);
    }

    /**
     * @notice Verifies hash integrity, ownership, revocation status, and metadata
     */
    function verifyHash(bytes32 _sha256Hash)
        external
        view
        returns (
            bool exists,
            address fileOwner,
            uint256 timestamp,
            uint256 fileSize,
            string memory metadataUri,
            bool isTesseraPrivate,
            bool isRevoked,
            string memory revocationReason,
            uint256 auditCount
        )
    {
        FileRecord memory rec = records[_sha256Hash];
        return (
            rec.timestamp > 0,
            rec.owner,
            rec.timestamp,
            rec.fileSize,
            rec.metadataUri,
            rec.isTesseraPrivate,
            rec.isRevoked,
            rec.revocationReason,
            rec.auditCount
        );
    }
}
