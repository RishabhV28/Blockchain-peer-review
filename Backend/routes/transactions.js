const express = require("express");
const router = express.Router();
const { mintCertificate, voteProposal } = require("../controllers/transactionController");

router.post("/mint-certificate", mintCertificate);
router.post("/vote", voteProposal);

module.exports = router;
