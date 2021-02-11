"use strict";
const util = require('util'),
    loggerService = require('./loggerService'),
    utilityService = require('./utilityService'),
    dic = require('../dictionary');


const dbService = {

    mongoFindOneObj: function(model, query, select, populate, options) {
        const fName = "mongoFindOneObj";

        return new Promise(((resolve, reject) => {
            if (!model || !query) {
                return reject(utilityService.createServerError(fName, "model and query are required"));
            }

            if (populate) {
                model.findOne(query, select, options).populate(populate).lean().exec((err, data) => {
                    if (err) {
                        return reject(utilityService.createServerError(fName, {text: "error looking for data", model: model.modelName, query: query, err: err}));
                    }
                    if (!data) {
                        return reject(utilityService.createUserError(fName, util.format(dic.ERRORS.objNotFound, options && options.name || 'object')));
                    }

                    loggerService.write(fName, `${data._id} was found in DB`);
                    resolve(data);
                });
            }
            else {
                model.findOne(query, select, options).lean().exec((err, data) => {
                    if (err) {
                        return reject(utilityService.createServerError(fName, {text: "error looking for data", model: model.modelName, query: query, err: err}));
                    }
                    if (!data) {
                        return reject(utilityService.createUserError(fName, util.format(dic.ERRORS.objNotFound, options && options.name || 'object')));
                    }

                    loggerService.write(fName, `${data._id} was found in DB`);
                    resolve(data);
                });
            }
        }));
    },

    mongoBulkUpdate(model, data) {
        const fName = 'mongoBulkUpdate';

        if (!model || !data || !data.length) {
            return Promise.reject(utilityService.createServerError(fName, "model and data are required"));
        }

        const bulkOps = data.map(item => ({
            updateOne: {
                filter: item.query,
                update: item.updateData,
                upsert: true
            }
        }));

        model.bulkWrite(bulkOps).then(bulkWriteOpResult => {
            loggerService.write(fName, `BULK update OK - ${bulkWriteOpResult.modifiedCount} documents updated successfully`);
        })
        .catch(err => {
            loggerService.write(fName, `BULK update error`);
        });
    }
};

module.exports = dbService;
