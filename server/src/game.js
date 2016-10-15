function Game (id, name, maxPlayers, password) {
    this.id = id;
    this.name = name;
    this.password = password ? password : '';
    this.maxPlayers = maxPlayers > 2 && maxPlayers < 10 ? maxPlayers : 4;
    this.players = {};
    this.started = false;

    this.socket_room_name = '/game/' + this.id + '-' + this.name;
}

Game.prototype = {

    constructor : Game,

    addPlayer: function (player) {
        this.players[player.nickname] = {};
        player.join(this.socket_room_name);
        player.leave('lobby');
        player.game = this.id;
        if (!this.started && !this._hasAvailableSlot()) {
            this.started = true;
        }
    },

    removePlayer: function (player) {
        player.join('lobby');
        player.leave(this.socket_room_name);
        player.game = null;
        delete this.players[player.nickname];
    },

    removeAllPlayers: function (players) {
        var playersToRemove = this.getPlayersList();
        var self = this;
        playersToRemove.forEach(function (nickname) {
            if (players[nickname]) {
                self.removePlayer(players[nickname]);
            }
        });
    },

    acceptPlayer: function (player, data) {
        return !this.started &&
            this._hasAvailableSlot() &&
            this._passwordIsCorrect(data) &&
            !this._hasPlayer(player)
    },

    isStillPlayable: function () {
        return this.countPlayers() > 2;
    },

    isOpen: function () {
        return !this.started && this._hasAvailableSlot();
    },

    summary: function () {
        return {
            name: this.name,
            id: this.id,
            maxPlayers: this.maxPlayers,
            players: this.countPlayers(),
            password: this.password.length > 0
        };
    },

    emit: function (io, event, message) {
        if (data === undefined) {
            io.sockets.in(this.socket_room_name).emit(event);
        } else {
            io.sockets.in(this.socket_room_name).emit(event, message);
        }
    },

    placePlayerShips: function (player, ships) {

    },

    placePlayerBomb: function (player, bomb) {

    },

    getPlayersList: function () {
        return Object.keys(this.players);
    },

    countPlayers: function () {
        return this.getPlayersList().length;
    },

    _hasPlayer: function (player) {
        return player.nickname in this.players;
    },

    _hasAvailableSlot: function () {
        return this.countPlayers() < this.maxPlayers;
    },

    _passwordIsCorrect: function (data) {
        if (this.password.length > 0) {
            return this.password === data.password;
        }
        return true;
    }
};

module.exports = Game;
