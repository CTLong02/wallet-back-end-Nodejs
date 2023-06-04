const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.use('/signIn', AuthController.signIn);
router.use('/signOut', AuthController.signOut);
router.use('/signUp', AuthController.signUp);
module.exports = router;
