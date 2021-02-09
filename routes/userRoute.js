const router = require('express').Router(),
    userCtrl = require('../controllers/userCtrl');

router.route('/')
    .get(userCtrl.getUser);

module.exports = router;
