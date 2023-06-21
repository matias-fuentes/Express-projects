const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'), bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;
