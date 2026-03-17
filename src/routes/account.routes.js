const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account.controller");
const { authMiddleware } = require("../middleware/jwt.middleware");

router.post("/create", authMiddleware,accountController.createAccount);
router.post("/deposit", authMiddleware,accountController.depositMoney);
router.post("/withdraw",authMiddleware,accountController.withdrawMoney);
router.post("/transfer", authMiddleware,accountController.transferMoney);
router.get("/account", authMiddleware,accountController.getAccount);
router.get("/transactions",authMiddleware,accountController.getTransactions);


module.exports = router;