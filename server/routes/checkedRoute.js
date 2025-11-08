const express = require('express');
const router = express.Router();
const { processCheckout } = require('../controllers/checkout.controller');
const { validate, checkoutSchema } = require('../validation');

router.post('/', validate(checkoutSchema), processCheckout);

module.exports = router;