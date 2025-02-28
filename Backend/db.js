require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Smart Contract Connection
const provider = new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Smart Contract ABIs and Addresses
const eduCoinABI = require("./abis/EduCoin.json"); // Ensure you export ABI from Hardhat
const daoABI = require("./abis/DAO.json");

const eduCoinAddress = "DEPLOYED_EDUCOIN_ADDRESS";
const daoAddress = "DEPLOYED_DAO_ADDRESS";

const eduCoin = new ethers.Contract(eduCoinAddress, eduCoinABI, wallet);
const dao = new ethers.Contract(daoAddress, daoABI, wallet);

// Define Mongoose Models
const ProposalSchema = new mongoose.Schema({
  proposalId: Number,
  creator: String,
  description: String,
  votesFor: Number,
  votesAgainst: Number,
  executed: Boolean,
});
const Proposal = mongoose.model("Proposal", ProposalSchema);

// **Create Proposal & Save in MongoDB**
app.post("/create-proposal", async (req, res) => {
  try {
    const { description } = req.body;
    const tx = await dao.createProposal(description);
    await tx.wait();

    // Fetch the proposal ID from event logs
    const proposalCount = await dao.proposalCount();
    const newProposal = new Proposal({
      proposalId: proposalCount.toString(),
      creator: wallet.address,
      description,
      votesFor: 0,
      votesAgainst: 0,
      executed: false,
    });

    await newProposal.save();
    res
      .status(200)
      .json({
        message: "Proposal created successfully",
        proposalId: proposalCount.toString(),
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Vote on a Proposal & Update MongoDB**
app.post("/vote", async (req, res) => {
  try {
    const { proposalId, inFavor, voterAddress } = req.body;

    const tx = await dao.connect(wallet).vote(proposalId, inFavor);
    await tx.wait();

    const proposal = await Proposal.findOne({ proposalId });
    if (proposal) {
      if (inFavor) {
        proposal.votesFor += 1;
      } else {
        proposal.votesAgainst += 1;
      }
      await proposal.save();
    }

    res.status(200).json({ message: "Vote casted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Fetch All Proposals**
app.get("/proposals", async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.status(200).json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Start Server**
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
