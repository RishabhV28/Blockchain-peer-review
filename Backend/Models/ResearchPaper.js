import mongoose from "mongoose";

const ResearchPaperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    ipfsHash: { type: String, required: true },
    walletAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ResearchPaper = mongoose.model("ResearchPaper", ResearchPaperSchema);
export default ResearchPaper;
