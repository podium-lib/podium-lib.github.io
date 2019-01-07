const express = require('express');
const app = express();
const { createReadStream } = require('fs');
const { resolve } = require('path');

app.use(
    '/podium-lib/docs',
    express.static(__dirname + '/../docs', {
        maxAge: 60000,
    })
);

app.get('/podium-lib', (req, res) => {
    res.redirect('/podium-lib/index.html');
});

app.get('/podium-lib/index.html', (req, res) => {
    createReadStream(resolve(__dirname, '../index.html')).pipe(res);
});

app.get('/', (req, res) => {
    res.redirect('/podium-lib');
});

app.listen(5000);
console.log('Listening on port 5000');
