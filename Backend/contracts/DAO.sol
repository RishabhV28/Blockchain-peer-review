// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAO is Ownable {
    IERC20 public eduToken;
    uint256 public proposalCount;

    struct Proposal {
        address creator;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, address creator, string description);
    event VoteCasted(uint256 indexed proposalId, address voter, bool inFavor);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address _eduToken) Ownable(msg.sender) {
        eduToken = IERC20(_eduToken);
    }

    function createProposal(string memory description) public {
        proposalCount += 1;
        proposals[proposalCount] = Proposal(msg.sender, description, 0, 0, false);
        emit ProposalCreated(proposalCount, msg.sender, description);
    }

    function vote(uint256 proposalId, bool inFavor) public {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        uint256 voterBalance = eduToken.balanceOf(msg.sender);
        require(voterBalance > 0, "Must hold EDU tokens to vote");

        Proposal storage proposal = proposals[proposalId];
        if (inFavor) {
            proposal.votesFor += voterBalance;
        } else {
            proposal.votesAgainst += voterBalance;
        }

        hasVoted[proposalId][msg.sender] = true;
        emit VoteCasted(proposalId, msg.sender, inFavor);
    }

    function executeProposal(uint256 proposalId) public onlyOwner {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");

        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
}
