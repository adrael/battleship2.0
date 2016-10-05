var restify = require('restify'),
    routes = require('./src/routes.js'),
    socket = require('./src/socket.js');

var server = restify.createServer();

routes(server, restify);
socket(server);

server.listen(8080, function () {
    console.log('server open at: %s', server.url);
});
