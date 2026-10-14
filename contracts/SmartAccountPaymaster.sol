// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SmartAccountPaymaster
 * @dev ERC-4337 Compliant Paymaster Contract for sponsoring dOS enterprise user gas fees
 * @author Shashank Sharma (MCA Semester 3)
 */
contract SmartAccountPaymaster {
    address public owner;
    mapping(address => bool) public approvedUserAccounts;
    uint256 public totalGasSponsoredWei;

    event GasSponsored(address indexed userAccount, uint256 gasAmountWei, bytes32 indexed userOpHash);
    event AccountWhitelisted(address indexed userAccount, bool status);

    modifier onlyOwner() {
        require(msg.sender == owner, "Paymaster: only owner allowed");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Deposit ETH into Paymaster gas pool
     */
    receive() external payable {}

    function depositGasPool() external payable {
        require(msg.value > 0, "Deposit must be greater than zero");
    }

    /**
     * @notice Whitelist a user's ERC-4337 Smart Account for gas-free dOS usage
     */
    function setAccountWhitelist(address _userAccount, bool _status) external onlyOwner {
        approvedUserAccounts[_userAccount] = _status;
        emit AccountWhitelisted(_userAccount, _status);
    }

    /**
     * @notice Validate and sponsor user operation gas fee
     */
    function validateAndSponsorPaymasterOp(
        address _userAccount,
        uint256 _maxGasCost,
        bytes32 _userOpHash
    ) external returns (bool sponsored) {
        require(
            approvedUserAccounts[_userAccount] || _userAccount == owner,
            "Paymaster: user account not whitelisted"
        );
        require(address(this).balance >= _maxGasCost, "Paymaster: insufficient gas pool deposit");

        totalGasSponsoredWei += _maxGasCost;
        emit GasSponsored(_userAccount, _maxGasCost, _userOpHash);

        return true;
    }

    /**
     * @notice Get current Paymaster deposit balance in Wei
     */
    function getGasPoolBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
