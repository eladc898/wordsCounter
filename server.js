const express = require('express');
const bodyParser = require('body-parser');
const connectDb = require('./models/index');
const app = express();
const port = 3000;

app.set('port', (process.env.PORT || port));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/word', require('./routes/wordRoute'));

connectDb().then(async () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}!`);
    });
});
