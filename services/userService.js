"use strict";

const utilityService = require('./utilityService'),
    axios = require('axios');

const userService = {

    getUser(cb) {
        axios.get('https://hs-resume-data.herokuapp.com/v3/candidates/all_data_b1f6-acde48001122')
        .then((response) => {
            if (response.data && response.data.length) {

            }
            // console.log('All candidates data:', candidates);
            cb(null, {});
        }, err => {
            cb(err);
        });
    }
}

module.exports = userService;
