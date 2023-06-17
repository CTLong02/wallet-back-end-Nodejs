const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

router.use('/fullname', ServiceController.getNameByNumberPhone);
router.use('/transfer-money', ServiceController.transferMoney);
module.exports = router;
