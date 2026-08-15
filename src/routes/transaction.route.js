const express = require("express");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware");

transactionRouter.post(
  "/",
  authMiddleware.authMiddleware,
  transactionController.createTransaction,
);
transactionRouter.post(
  "/system/initial-funds",
  authMiddleware.authSystemMiddlerware,
  transactionController.createInitialFundsTransaction,
);

module.exports = transactionRouter;
