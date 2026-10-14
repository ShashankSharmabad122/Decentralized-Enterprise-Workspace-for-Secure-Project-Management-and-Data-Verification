// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/UserRoleAccess.sol";

contract UserRoleAccessTest is Test {
    UserRoleAccess internal rbac;

    address internal admin = address(0xA1);
    address internal auditor = address(0xB2);
    address internal user = address(0xC3);

    function setUp() public {
        vm.prank(admin);
        rbac = new UserRoleAccess();
    }

    function test_DefaultAdminHasRoles() public {
        assertTrue(rbac.hasRole(rbac.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(rbac.hasRole(rbac.AUDITOR_ROLE(), admin));
        assertTrue(rbac.hasRole(rbac.USER_ROLE(), admin));
    }

    function test_GrantAndRevokeRole() public {
        vm.startPrank(admin);
        rbac.grantRole(rbac.AUDITOR_ROLE(), auditor);
        assertTrue(rbac.hasRole(rbac.AUDITOR_ROLE(), auditor));

        rbac.revokeRole(rbac.AUDITOR_ROLE(), auditor);
        assertFalse(rbac.hasRole(rbac.AUDITOR_ROLE(), auditor));
        vm.stopPrank();
    }

    function testRevert_UnauthorizedGrantRole() public {
        vm.prank(user);
        vm.expectRevert("UserRoleAccess: caller is not default admin");
        rbac.grantRole(rbac.AUDITOR_ROLE(), user);
    }

    function test_TransferAdmin() public {
        address newAdmin = address(0xDD);
        vm.prank(admin);
        rbac.transferAdmin(newAdmin);

        assertEq(rbac.defaultAdmin(), newAdmin);
        assertTrue(rbac.hasRole(rbac.DEFAULT_ADMIN_ROLE(), newAdmin));
    }
}
