const CONSTANTS = {
	mongoCollections: {
		word: "lemonade_words"
	},

	errorTypes: {
		user: 400,
		server: 500
	},

	dataType: {
		text: 'text',
		file: 'file',
		url: 'url'
	},

	word: 'word',

	oneKb: 1024,
	// wordsRegex: /[-,!?(){}0-9\r\n]/ig
	wordsRegex: /[^a-zA-Z]/ig,
	urlRegex: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
};

const MESSAGES = {};
const ERRORS = {
	objNotFound: '%s not found',
	invalidType: 'Request type is invalid. set type to one of the following: text/file/url',
	invalidFile: 'Invalid file type. provide a file with ".txt" extension',
	invalidUrl: 'Invalid url',
	invalidCountParam: 'type or payload fields are missing',
	invalidWordParam: 'Invalid request parameter. add word as query parameter to get statistics of word'
};

module.exports.MESSAGES = MESSAGES;
module.exports.ERRORS = ERRORS;
module.exports.CONSTANTS = CONSTANTS;
