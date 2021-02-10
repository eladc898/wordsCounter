"use strict";

const axios = require('axios'),
	http = require('http');

const dataService = {

	getHttpData(url, headers, params) {
		return http.get(url);
	},

	getData(url, headers, params) {
		return axios.get(url, {
			headers: headers || {},
			params: params || {},
			responseType: 'json'
		});
	},

	postData(url, body, headers) {
		return axios.post(url, body, {
			headers: headers || {},
			responseType: 'json'
		});
	}
};

module.exports = dataService;
