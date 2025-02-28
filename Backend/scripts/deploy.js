const hre = require("hardhat");

async function main() {
    // Deploy EduCoin (ERC-20 Token)
    const EduCoin = await hre.ethers.getContractFactory("EduCoin");
    const eduCoin = await EduCoin.deploy();
    await eduCoin.deployed();
    console.log("EduCoin deployed to:", eduCoin.address);

    // Deploy CertificateNFT (ERC-721 NFT)
    const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
    const certificateNFT = await CertificateNFT.deploy();
    await certificateNFT.deployed();
    console.log("CertificateNFT deployed to:", certificateNFT.address);

    // Deploy ResearchRegistry
    const ResearchRegistry = await hre.ethers.getContractFactory("ResearchRegistry");
    const researchRegistry = await ResearchRegistry.deploy();
    await researchRegistry.deployed();
    console.log("ResearchRegistry deployed to:", researchRegistry.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
