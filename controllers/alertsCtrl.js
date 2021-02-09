"use strict";

const alertsService = require('../services/alertsService');

const alertsCtrl = {

    getAlerts(req, res) {
        try {
            alertsService.getAlerts().then(() => {
                res.status(200).end();
            }, err => {
                res.status(400).json(err);
            });
        }
        catch (ex) {
            res.status(500).json(ex && ex.stack);
        }
    }
};


module.exports = alertsCtrl;
