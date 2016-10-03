var restify = require('restify');
var server = restify.createServer();

server.get(/\/?.*/, restify.serveStatic({
    "directory": __dirname + '/../www/dist/'
}));

var SOCKETS = {};

var sendToAll = function (message, data) {
    for (var s in SOCKETS) {
        if (SOCKETS.hasOwnProperty(s)) {
            SOCKETS[s].emit(message, data);
        }
    }
};

var io = require('socket.io').listen(server.server);
io.sockets.on('connection', function (socket) {

    SOCKETS[socket.id] = socket;
    sendToAll('new user', { 'id': socket.id });

    socket.on('disconnect', function () {
        sendToAll('left room', { 'id': socket.id });
    });

    socket.on('message', function (data) {
        var message = 'user ' + socket.id + ' said: ' + data.msg;
        sendToAll('message', {
            'id' : socket.id,
            'msg' : data.msg
        });
    });
});

server.listen(8080, function () {
    console.log('server open at: %s', server.url);
    console.log(__dirname + '/../www/dist/');
});
