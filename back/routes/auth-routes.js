const express = require('express');
const router = express.Router();
const {Register, Login, Logout} = require('../controllers/auth-controller');

router.post("/",Register);
router.post('/login',Login);
router.delete("/logout",Logout);

module.exports = router;