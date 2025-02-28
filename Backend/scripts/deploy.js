import hre from "hardhat";  // Import Hardhat correctly

async function main() {
    const EduCoin = await hre.ethers.getContractFactory("EduCoin");
    const eduCoin = await EduCoin.deploy();
    await eduCoin.deployed();
    console.log("EduCoin deployed to:", eduCoin.address);

    const CertificateNFT = await hre.ethers.getContractFactory("CertificateNFT");
    const certificateNFT = await CertificateNFT.deploy();
    await certificateNFT.deployed();
    console.log("CertificateNFT deployed to:", certificateNFT.address);

    const ResearchRegistry = await hre.ethers.getContractFactory("ResearchRegistry");
    const researchRegistry = await ResearchRegistry.deploy();
    await researchRegistry.deployed();
    console.log("ResearchRegistry deployed to:", researchRegistry.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
