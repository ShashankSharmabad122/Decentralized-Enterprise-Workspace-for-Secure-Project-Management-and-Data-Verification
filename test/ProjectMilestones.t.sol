// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/ProjectMilestones.sol";

contract ProjectMilestonesTest is Test {
    ProjectMilestones internal milestones;

    address internal admin = address(0xA1);
    address internal auditor1 = address(0xB1);
    address internal auditor2 = address(0xB2);
    address internal assignee = address(0xC1);

    function setUp() public {
        vm.startPrank(admin);
        milestones = new ProjectMilestones();
        milestones.grantRole(milestones.AUDITOR_ROLE(), auditor1);
        milestones.grantRole(milestones.AUDITOR_ROLE(), auditor2);
        vm.stopPrank();
    }

    function test_CreateSubmitApproveAndReleaseMilestone() public {
        uint256 milestoneId = 101;
        uint256 budgetWei = 2.5 ether;

        // Admin creates milestone
        vm.prank(admin);
        milestones.createMilestone(milestoneId, "Phase 2 Smart Contracts", budgetWei, assignee);

        // Assignee submits proof hash
        bytes32 proofHash = keccak256("SHA256_Proof_Of_Milestone_Completion_2026");
        vm.prank(assignee);
        milestones.submitProof(milestoneId, proofHash);

        // Auditor 1 approves milestone
        vm.prank(auditor1);
        milestones.approveMilestone(milestoneId);

        // Auditor 2 approves milestone (2nd approval triggers auto-release)
        vm.prank(auditor2);
        milestones.approveMilestone(milestoneId);

        (, , , ProjectMilestones.MilestoneStatus status, bytes32 savedProof, address savedAssignee, uint256 approvals) =
            milestones.milestones(milestoneId);

        assertEq(uint256(status), uint256(ProjectMilestones.MilestoneStatus.RELEASED));
        assertEq(savedProof, proofHash);
        assertEq(savedAssignee, assignee);
        assertEq(approvals, 2);
    }

    function test_DisputeMilestoneByAuditor() public {
        uint256 milestoneId = 102;
        
        vm.prank(admin);
        milestones.createMilestone(milestoneId, "Phase 3 Frontend", 1.0 ether, assignee);

        vm.prank(auditor1);
        milestones.disputeMilestone(milestoneId, "Incomplete proof of delivery");

        (, , , ProjectMilestones.MilestoneStatus status, , , ) = milestones.milestones(milestoneId);
        assertEq(uint256(status), uint256(ProjectMilestones.MilestoneStatus.DISPUTED));
    }
}
