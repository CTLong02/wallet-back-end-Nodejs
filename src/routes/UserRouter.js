const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.use('/avatar/:idAvatar', UserController.getAvatar);
module.exports = router;
