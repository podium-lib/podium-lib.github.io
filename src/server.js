const express = require('express');
const app = express();
const { createReadStream } = require('fs');
const { resolve } = require('path');

app.use(
    '/Podium/docs',
    express.static(__dirname + '/../docs', {
        maxAge: 60000,
    })
);

app.get('/Podium', (req, res) => {
    res.redirect('/Podium/index.html');
});

app.get('/Podium/index.html', (req, res) => {
    createReadStream(resolve(__dirname, '../index.html')).pipe(res);
});

app.get('/', (req, res) => {
    res.redirect('/Podium');
});

app.listen(5000);
console.log('Listening on port 5000');
