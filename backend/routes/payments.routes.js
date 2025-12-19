const express = require("express");
const router = express.Router();
const PaymentsController = require("../controllers/paymentsController");

// JOIN LIST (For frontend table)
router.get("/join", PaymentsController.getPaymentsJoin);

// GET ALL
router.get("/", PaymentsController.getPayments);

// SEARCH
router.get("/search/:keyword", PaymentsController.searchPayments);

// CREATE
router.post("/", PaymentsController.createPayment);

// DELETE ALL
router.delete("/delete/all", PaymentsController.deleteAllPayments);

// DELETE ONE
router.delete("/:id", PaymentsController.deletePayment);

module.exports = router;
