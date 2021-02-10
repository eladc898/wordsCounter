const mongoose = require('mongoose'),
	Word = require('./wordModel');

const connectDb = () => {
	return mongoose.connect('mongodb://127.0.0.1:27017/lemonade-challenge-db');
};

const models = { Word };

module.exports = connectDb;
