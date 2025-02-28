const { create } = require("ipfs-http-client");
const { ethers } = require("ethers");
const { ResearchRegistryABI, contractAddress } = require("../utils/contracts");

const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, ResearchRegistryABI, wallet);

const ipfs = create({ url: "https://ipfs.infura.io:5001/api/v0" });

exports.submitResearch = async (req, res) => {
    const { title, content, author } = req.body;

    try {
        // Upload research paper to IPFS
        const added = await ipfs.add(content);
        const ipfsHash = added.path;

        // Store metadata on blockchain
        const tx = await contract.submitResearch(title, ipfsHash);
        await tx.wait();

        res.json({ message: "Research submitted", ipfsHash, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: "Submission failed" });
    }
};
