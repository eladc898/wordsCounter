const router = require('express').Router(),
    wordCtrl = require('../controllers/wordCtrl');

router.route('/count')
    .post(wordCtrl.countWords);

router.route('/statistics')
    .get(wordCtrl.getWordStatistics);

module.exports = router;
