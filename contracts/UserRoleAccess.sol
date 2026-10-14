// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title UserRoleAccess
 * @dev Enterprise Zero-Trust Role-Based Access Control (RBAC) Smart Contract for dOS Workspace
 * @author Shashank Sharma (MCA Semester 3)
 */
contract UserRoleAccess {
    bytes32 public constant DEFAULT_ADMIN_ROLE = keccak256("DEFAULT_ADMIN_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    address public defaultAdmin;

    // Role -> Account -> HasRole
    mapping(bytes32 => mapping(address => bool)) private _roles;
    
    // Role -> Total Members Count
    mapping(bytes32 => uint256) private _roleMemberCount;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);
    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || msg.sender == defaultAdmin,
            "UserRoleAccess: caller is not default admin"
        );
        _;
    }

    modifier onlyRole(bytes32 role) {
        require(
            hasRole(role, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || msg.sender == defaultAdmin,
            "UserRoleAccess: sender does not have required role"
        );
        _;
    }

    constructor() {
        defaultAdmin = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
        _grantRole(USER_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @notice Checks whether an account has a specific role
     */
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role][account];
    }

    /**
     * @notice Returns total number of accounts granted a specific role
     */
    function getRoleMemberCount(bytes32 role) external view returns (uint256) {
        return _roleMemberCount[role];
    }

    /**
     * @notice Grants a role to an account (Only Default Admin)
     */
    function grantRole(bytes32 role, address account) public onlyAdmin {
        require(account != address(0), "Invalid zero address");
        if (!_roles[role][account]) {
            _grantRole(role, account);
        }
    }

    /**
     * @notice Revokes a role from an account (Only Default Admin)
     */
    function revokeRole(bytes32 role, address account) public onlyAdmin {
        require(account != address(0), "Invalid zero address");
        if (_roles[role][account]) {
            _roles[role][account] = false;
            if (_roleMemberCount[role] > 0) {
                _roleMemberCount[role]--;
            }
            emit RoleRevoked(role, account, msg.sender);
        }
    }

    /**
     * @notice Renounces a role by caller
     */
    function renounceRole(bytes32 role) public {
        if (_roles[role][msg.sender]) {
            _roles[role][msg.sender] = false;
            if (_roleMemberCount[role] > 0) {
                _roleMemberCount[role]--;
            }
            emit RoleRevoked(role, msg.sender, msg.sender);
        }
    }

    /**
     * @notice Transfers default admin power to new address
     */
    function transferAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be zero address");
        address oldAdmin = defaultAdmin;
        defaultAdmin = newAdmin;
        _grantRole(DEFAULT_ADMIN_ROLE, newAdmin);
        emit AdminTransferred(oldAdmin, newAdmin);
    }

    function _grantRole(bytes32 role, address account) internal {
        _roles[role][account] = true;
        _roleMemberCount[role]++;
        emit RoleGranted(role, account, msg.sender);
    }
}
