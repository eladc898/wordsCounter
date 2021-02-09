"use strict";

const userService = require('../services/userService');

const userCtrl = {
    getUser(req, res) {
        const fName = "getUser";

        try {
            userService.getUser((err, data) => {
                if (err) {
                    res.status(err.error).json(err);
                }
                else {
                    res.status(201).json(data);
                }
            });
        }
        catch (ex) {
            res.status(500).json(ex && ex.stack);
        }
    }
};

module.exports = userCtrl;
