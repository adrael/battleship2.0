var restify = require('restify'),
    socket = require('./src/socket.js');

var server = restify.createServer();

socket(server);

server.listen(8080, function () {
    console.log('server open at: %s', server.url);
});
