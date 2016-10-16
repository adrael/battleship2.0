module.exports = function (io) {
    var Game = require('./game');
    var words = require('./words');

    var gameId = 0;

    var bf = {
        sockets: {},
        games: {}
    };

    var pickOne = function(list) {
        return list[Math.floor(Math.random() * list.length)];
    };

    var generateNickname = function () {
        var nickname;
        do {
            nickname = pickOne(words.adjectives) + ' ' + pickOne(words.nouns);
        } while (nickname in bf.sockets);
        return nickname;
    };

    var isPlaying = function (player) {
        return !player.game || player.game in bf.games;
    };

    io.sockets.on('connection', function (player) {

        player.nickname = generateNickname();
        player.game = null;
        bf.sockets[player.nickname] = player;
        player.join('lobby');

        player.emit('nickname', player.nickname);

        player.on('disconnect', function () {
            if (player.game !== null) {
                bf.games[player.game].removePlayer(player);
            }
            delete bf.sockets[player.nickname];
        });

        // room creation

        player.on('create game', function (gameData) {
            if (isPlaying(player)) {
                gameId += 1;
                var game = new Game(gameId, gameData.name, gameData.maxPlayers, gameData.password);
                game.addPlayer(player);
                bf.games[game.id] = game;
                player.emit('game created', game.summary());
            }
        });

        player.on('join game', function (data) {
            var gameId = data.gameId;
            if (gameId !== undefined && gameId in bf.games) {
                var game = bf.games[gameId];
                if (game.acceptPlayer(player, data)) {
                    game.addPlayer(player);
                    game.emit(io, 'new player', {nickname: player.nickname});
                    if (game.started) {
                        game.emit(io, 'game start');
                    }
                } else {
                    player.emit('refused');
                }
            } else {
                player.emit('error', 'no game with this id (' + gameId + ')');
            }
        });

        player.on('leave game', function () {
            if (player.game !== null) {
                var game = bf.games[player.game];
                game.removePlayer(player);
                game.emit(io, 'player left', {nickname: player.nickname});
                player.emit('game left');
                var playersCount = game.countPlayers();
                if (playersCount <= 0 || (game.started && !game.isStillPlayable())) {
                    if (playersCount > 0) {
                        game.emit('game stoped', 'sorry');
                        game.removeAllPlayers(bf.sockets);
                    }
                    delete bf.games[game.id];
                }
            } else {
                player.emit('error', 'To leave a game, you first need to join one…');
            }
        });

        player.on('list games', function () {
            var games = [];
            Object.keys(bf.games).forEach(function (id) {
                if (bf.games[id].isOpen()) {
                    games.push(bf.games[id].summary());
                }
            });
            player.emit('list games', games);
        });

        // game

        player.on('place ships', function (ships) {
            if (isPlaying(player)) {
                var game = bf.games[player.game];
                if (game.placePlayerShips(player, ships)) {
                    player.emit('ship placed', true);
                } else {
                    player.emit('ship placed', {error: 'learn how to place your ships…'});
                }
            }
        });

        player.on('place bomb', function (bomb) {
            if (isPlaying(player)) {
                var game = bf.games[player.game];
                if (game.placePlayerBomb(player, bomb)) {
                    player.emit('bomb placed', true);
                } else {
                    player.emit('bomb placed', {error: 'learn how to place a bomb…'});
                }
            }
        });

        // chat

        player.on('message', function (message) {
            var messageData = {
                id: player.id,
                nickname: player.nickname,
                message: message
            };

            if (isPlaying(player)) {
                bf.games[player.game].emit(io, 'message', messageData);
            } else {
                io.sockets.in('lobby').emit('message', messageData);
            }
        });

    });

};
