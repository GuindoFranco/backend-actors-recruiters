const http = require('http');

const express = require('express');

const app = express();

app.get('/login', (req, res, next) => {
    
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

const server = http.createServer(app);

server.listen(3000);