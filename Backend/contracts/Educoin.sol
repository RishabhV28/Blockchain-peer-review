// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EduCoin is ERC20, Ownable {
    constructor() ERC20("EduCoin", "EDU") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Initial supply
    }

    function rewardUser(address recipient, uint256 amount) external onlyOwner {
        _mint(recipient, amount); // Mint new tokens instead of transferring
    }
}
