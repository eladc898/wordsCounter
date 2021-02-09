const router = require('express').Router(),
    alertsCtrl = require('../controllers/alertsCtrl');

router.route('/')
    .get(alertsCtrl.getAlerts);

module.exports = router;
