const ethers = require("ethers");

exports.loginUser = async (req, res) => {
    const { address, signature, message } = req.body;

    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ error: "Invalid signature" });
        }
        res.json({ message: "Login successful", address });
    } catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }
};
