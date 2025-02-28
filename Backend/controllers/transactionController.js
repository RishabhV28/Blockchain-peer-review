const { ethers } = require("ethers");
const { CertificateNFTABI, DAOABI, certificateContractAddress, daoContractAddress } = require("../utils/contracts");

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const certificateContract = new ethers.Contract(certificateContractAddress, CertificateNFTABI, wallet);
const daoContract = new ethers.Contract(daoContractAddress, DAOABI, wallet);

exports.mintCertificate = async (req, res) => {
    const { student, metadataURI } = req.body;

    try {
        const tx = await certificateContract.issueCertificate(student, metadataURI);
        await tx.wait();
        res.json({ message: "Certificate minted", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: "Minting failed" });
    }
};

exports.voteProposal = async (req, res) => {
    const { proposalId, inFavor } = req.body;

    try {
        const tx = await daoContract.vote(proposalId, inFavor);
        await tx.wait();
        res.json({ message: "Vote submitted", txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: "Voting failed" });
    }
};
