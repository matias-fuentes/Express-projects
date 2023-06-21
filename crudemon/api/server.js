const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '.env' });

const app = express();

app.use(express.static('build'), bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

app.get('/api/pokemons/', async (req, res) => {
    const response = await fetch(`${process.env.FIREBASE_URL}/pokemons.json`);
    const pokemons = await response.json();

    res.json(pokemons);
});

app.post('/api/pokemons/', async (req, res) => {
    const { method, body, header } = req;

    const response = await fetch(`${process.env.FIREBASE_URL}/pokemons.json`, {
        method,
        body: JSON.stringify(body),
        header,
    });

    let pokemonId = await response.json();

    res.send(pokemonId);
});

app.put('/api/pokemons/:pokemonId', async (req, res) => {
    const { pokemonId } = req.params;
    const { method, body, header } = req;

    let response = await fetch(`${process.env.FIREBASE_URL}/pokemons/${pokemonId}.json`, {
        method,
        body: JSON.stringify(body),
        header,
    });

    response = await response.json();
    res.send(response);
});

app.delete('/api/pokemons/:pokemonId', async (req, res) => {
    const { pokemonId } = req.params;

    let response = await fetch(`${process.env.FIREBASE_URL}/pokemons/${pokemonId}.json`, {
        method: 'DELETE',
    });

    response = await response.json();
    res.send(response);
});

const port = process.env.PORT || 3000;
app.listen(port);
module.exports = app;
