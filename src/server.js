const express = require('express');
const app = express();
const { createReadStream } = require('fs');
const { resolve } = require('path');

app.use(
    '/docs',
    express.static(__dirname + '/../docs', {
        maxAge: 60000,
    })
);

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.get('/index.html', (req, res) => {
    createReadStream(resolve(__dirname, '../index.html')).pipe(res);
});

app.listen(5000);
console.log('Listening on port 5000');
