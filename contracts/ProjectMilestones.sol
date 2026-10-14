// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./UserRoleAccess.sol";

/**
 * @title ProjectMilestones
 * @dev Automated multi-signature escrow & milestone release smart contract for dOS Enterprise Workspace
 * @author Shashank Sharma (MCA Semester 3)
 */
contract ProjectMilestones is UserRoleAccess {
    enum MilestoneStatus { CREATED, IN_PROGRESS, PROOF_SUBMITTED, DISPUTED, RELEASED }

    struct Milestone {
        uint256 id;
        string title;
        uint256 budgetWei;
        MilestoneStatus status;
        bytes32 proofSha256;
        address assignee;
        uint256 approvalsCount;
    }

    mapping(uint256 => Milestone) public milestones;
    mapping(uint256 => mapping(address => bool)) public hasApprovedMilestone;

    event MilestoneCreated(uint256 indexed id, string title, uint256 budgetWei, address assignee);
    event ProofSubmitted(uint256 indexed id, bytes32 proofSha256);
    event MilestoneApproved(uint256 indexed id, address indexed verifier, uint256 totalApprovals);
    event MilestoneDisputed(uint256 indexed id, string reason);
    event MilestoneReleased(uint256 indexed id, uint256 budgetWei, address assignee);

    constructor() UserRoleAccess() {}

    function createMilestone(
        uint256 _id,
        string calldata _title,
        uint256 _budgetWei,
        address _assignee
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(milestones[_id].budgetWei == 0, "ProjectMilestones: Milestone ID already exists");

        milestones[_id] = Milestone({
            id: _id,
            title: _title,
            budgetWei: _budgetWei,
            status: MilestoneStatus.CREATED,
            proofSha256: bytes32(0),
            assignee: _assignee,
            approvalsCount: 0
        });

        emit MilestoneCreated(_id, _title, _budgetWei, _assignee);
    }

    function submitProof(uint256 _id, bytes32 _proofSha256) external {
        Milestone storage m = milestones[_id];
        require(m.id == _id, "ProjectMilestones: Milestone does not exist");
        require(
            msg.sender == m.assignee || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "ProjectMilestones: Not authorized to submit proof"
        );
        require(_proofSha256 != bytes32(0), "ProjectMilestones: Invalid proof hash");

        m.proofSha256 = _proofSha256;
        m.status = MilestoneStatus.PROOF_SUBMITTED;

        emit ProofSubmitted(_id, _proofSha256);
    }

    function approveMilestone(uint256 _id) external onlyRole(AUDITOR_ROLE) {
        Milestone storage m = milestones[_id];
        require(m.status == MilestoneStatus.PROOF_SUBMITTED, "ProjectMilestones: Proof must be submitted first");
        require(!hasApprovedMilestone[_id][msg.sender], "ProjectMilestones: Already approved by caller");

        hasApprovedMilestone[_id][msg.sender] = true;
        m.approvalsCount++;

        emit MilestoneApproved(_id, msg.sender, m.approvalsCount);

        // Auto release when reaching 2 approvals or admin approval
        if (m.approvalsCount >= 2 || hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            m.status = MilestoneStatus.RELEASED;
            emit MilestoneReleased(_id, m.budgetWei, m.assignee);
        }
    }

    function disputeMilestone(uint256 _id, string calldata _reason) external onlyRole(AUDITOR_ROLE) {
        Milestone storage m = milestones[_id];
        require(m.status != MilestoneStatus.RELEASED, "ProjectMilestones: Cannot dispute released milestone");

        m.status = MilestoneStatus.DISPUTED;
        emit MilestoneDisputed(_id, _reason);
    }
}
