const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencykey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencykey) {
    return res.status(400).json({
      message:
        "fromAccount, toAccount, amount and idempotencykey are required...",
    });
  }

  const fromAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromAccount || !toAccount) {
    return res.status(401).json({
      message: "Invalid fromAccount to toAccount",
    });
  }

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencykey: idempotencykey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      res.status(200).json({
        message: "Transaction already processed",
        transaction: isTransactionAlreadyExists,
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      res.status(200).json({
        message: "Transaction is still processing",
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      res.status(500).json({
        message: "Transaction Failed",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      res.status(500).json({
        message: "Transaction was reversed,please retry",
      });
    }
  }

  if (fromAccount.status !== "ACTIVE" || toAccount.status !== "ACTIVE") {
    return res.status(401).json({
      message:
        "For transaction fromAccount and toAccount status must be ACTIVE",
    });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance.Current balance is ${balance}.Requested amount is ${amount}`,
    });
  }

  const session = await mongoose.startSessio();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencykey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  emailService.sendTransactionEmail(
    req.user.email,
    req.user.toAccount,
    req.user.fromAccount,
    req.user.amount,
  );

  return res.status(201).json({
    message:'Transaction successfully..',
    transaction:transaction
  })
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencykey } = req.body;

  if (!toAccount || !amount || !idempotencykey) {
    return res.status(401).json({
      message: "toAccount,amount and idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  console.log(toAccount);

  if (!toUserAccount) {
    return res.status(401).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(401).json({
      message: "system user account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = { createTransaction, createInitialFundsTransaction };
