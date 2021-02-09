const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userMiddleware = require('./middlewares/userMiddleware');

const app = express();
const port = 3000;

//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/27017';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('port', (process.env.PORT || port));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/alerts', require('./routes/alertsRoute'));
app.use('/api/v1/user', userMiddleware, require('./routes/userRoute'));

app.listen(app.get('port'), function() {
    console.log('Server running on port: ' + port);
});
