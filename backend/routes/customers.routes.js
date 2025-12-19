const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/CustomerController");

// GET
router.get("/", CustomerController.getCustomers);
router.get("/:id", CustomerController.getCustomerById);

// POST
router.post("/", CustomerController.createCustomer);

// DELETE ALL (IMPORTANT: PLACE BEFORE /:id)
router.delete("/delete/all", CustomerController.deleteAllCustomers);

// DELETE ONE
router.delete("/:id", CustomerController.deleteCustomer);

// UPDATE
router.put("/:id", CustomerController.updateCustomer);

// SEARCH (must be last)
router.get("/search/:keyword", CustomerController.searchCustomers);

module.exports = router;
