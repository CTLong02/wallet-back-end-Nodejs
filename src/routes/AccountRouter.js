const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');

router.use('/upload-avatar', AccountController.uploadAvatar);
router.use('/create-card', AccountController.createCard);

module.exports = router;
