const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('dist'), bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);
