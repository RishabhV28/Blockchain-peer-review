import "dotenv/config";
import connectDB from "./db.js";  // ✅ This works now

import express from "express";
import cors from "cors";
import multer from "multer";
import ResearchPaper from "./Models/ResearchPaper.js";

import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { fromString } from "uint8arrays/from-string";

const app = express();
app.use(cors());
app.use(express.json());


connectDB();

// File Upload Config (for research papers)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Helia (IPFS)
async function initIPFS() {
    const ipfs = await createHelia();
    const fs = unixfs(ipfs);
    return { ipfs, fs };
}

const { ipfs, fs } = await initIPFS();

// Upload Research Paper
app.post("/upload", upload.single("paper"), async (req, res) => {
    const { title, author, walletAddress } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    try {
        // Upload to IPFS
        const fileBuffer = new Uint8Array(file.buffer);
        const cid = await fs.addBytes(fileBuffer);
        const ipfsHash = cid.toString();

        // Save metadata to MongoDB
        const newPaper = new ResearchPaper({ title, author, ipfsHash, walletAddress });
        await newPaper.save();

        res.json({ message: "File uploaded successfully", data: newPaper });
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
});

import helmet from "helmet";

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "http://localhost:8080"],
        connectSrc: ["'self'", "http://localhost:5000"], // Allow API requests
        styleSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
      },
    },
  })
);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

