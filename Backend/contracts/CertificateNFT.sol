// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    
    uint256 private _tokenIds;
    mapping(uint256 => bool) public revokedCertificates;

    constructor() ERC721("EduCertificate", "EDU") Ownable(msg.sender) {}

    function issueCertificate(address student, string memory metadataURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newCertificateId = _tokenIds;
        _mint(student, newCertificateId);
        _setTokenURI(newCertificateId, metadataURI);
        return newCertificateId;
    }

    function revokeCertificate(uint256 certificateId) public onlyOwner {
        revokedCertificates[certificateId] = true;
    }

    function isCertificateRevoked(uint256 certificateId) public view returns (bool) {
        return revokedCertificates[certificateId];
    }
}
