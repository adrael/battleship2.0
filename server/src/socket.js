module.exports = function (server) {
    var SOCKETS = {};
    var io = require('socket.io').listen(server.server);

    var sendToAll = function (message, data) {
        for (var s in SOCKETS) {
            if (SOCKETS.hasOwnProperty(s)) {
                SOCKETS[s].emit(message, data);
            }
        }
    };

    io.sockets.on('connection', function (socket) {

        SOCKETS[socket.id] = socket;

        socket.on('create room', function () {
        });

        socket.on('join room', function () {
        });

        socket.on('leave room', function () {
        });

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
};
