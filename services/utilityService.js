"use strict";

const utilityService = {
    dateDiffInDays: function(date1, date2) {
        return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
    }
}

module.exports = utilityService;
