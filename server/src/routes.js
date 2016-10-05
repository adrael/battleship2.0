module.exports = function (server, restify) {

    server.get('/rooms', function (req, res) {
        res.send(200);
    });

    server.get(/\/?.*/, restify.serveStatic({
        "directory": __dirname + '/../www/dist/'
    }));

};
