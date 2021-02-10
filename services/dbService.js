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

    mongoFindOneAndUpdate: function(model, query, data, options) {
        const fName = "mongoFindOneAndUpdate";

        return new Promise((resolve, reject) => {
            if (!model || !query || !data) {
                return reject(utilityService.createServerError(fName, "model, query and data are required"));
            }

            if (options) {
                model.findOneAndUpdate(query, data, options, (err, newData) => {
                    if (err) {
                        return reject(utilityService.createServerError(fName, {text: "failed update data", model: model.modelName, query: query, err: err}));
                    }
                    if (newData) {
                        loggerService.write(fName, `${newData.toObject()._id.toString()} updated successfully`);
                    }
                    resolve(newData);
                });
            }
            else {
                model.findOneAndUpdate(query, data, (err, newData) => {
                    if (err) {
                        return reject(utilityService.createServerError(fName, {text: "failed update data", model: model.modelName, query: query, err: err}));
                    }
                    if (newData) {
                        loggerService.write(fName, `${newData.toObject()._id.toString()} updated successfully`);
                    }
                    resolve(newData);
                });
            }
        });
    }
};

module.exports = dbService;
