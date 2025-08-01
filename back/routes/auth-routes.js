const express = require('express');
const router = express.Router();
const {Register, Login, Logout} = require('../controllers/auth-controller');
const Authenticate = require('../middlewares/auth-middleware');

router.post("/", Register);
router.post('/login', Login);
router.post("/logout", Authenticate, Logout);


router.get('/isConnected', Authenticate, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;