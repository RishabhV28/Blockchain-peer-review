// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ResearchRegistry {
    struct Research {
        address author;
        string title;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(uint256 => Research) public researchPapers;
    uint256 public researchCount;

    event ResearchSubmitted(uint256 indexed researchId, address indexed author, string title, string ipfsHash);

    function submitResearch(string memory title, string memory ipfsHash) public {
        researchCount++;
        researchPapers[researchCount] = Research(msg.sender, title, ipfsHash, block.timestamp);
        emit ResearchSubmitted(researchCount, msg.sender, title, ipfsHash);
    }

    function getResearch(uint256 researchId) public view returns (Research memory) {
        return researchPapers[researchId];
    }
}
