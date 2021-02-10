"use strict";

const http = require('http');

const dataService = {

	async getHttpData(url) {
		return new Promise((resolve, reject) => {
			const request = http.get(url, res => {
				if (res) {
					resolve(res);
				}
			});

			request.on('error', (e) => {
				reject(e);
			});
		});
	}
};

module.exports = dataService;
