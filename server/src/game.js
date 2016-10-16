function Game (id, name, maxPlayers, password) {
    this.id = id;
    this.name = name;
    this.password = password ? password : '';
    this.maxPlayers = maxPlayers >= 2 && maxPlayers <= 10 ? maxPlayers : 4;
    this.players = {};
    this.state = Game.STATE.WAITING_PLAYERS;

    this.socket_room_name = '/game/' + this.id + '-' + this.name;
}

Game.STATE = {
    READY: 1,
    PLAYING: 2,
    WAITING_PLAYERS: 3,
    SETTING: 4
};

Game.prototype = {

    constructor : Game,

    addPlayer: function (player) {
        this.players[player.nickname] = {
            isReady: false
        };
        player.join(this.socket_room_name);
        player.leave('lobby');
        player.game = this.id;
        this._updateState();
    },

    removePlayer: function (player) {
        player.join('lobby');
        player.leave(this.socket_room_name);
        player.game = null;
        delete this.players[player.nickname];
        this._updateState();
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
        return player.game === null &&
            this.state === Game.STATE.WAITING_PLAYERS &&
            this._hasAvailableSlot() &&
            this._passwordIsCorrect(data) &&
            !this._hasPlayer(player)
    },

    isStillPlayable: function () {
        return this.countPlayers() > 2;
    },

    isOpen: function () {
        return this.state === Game.STATE.WAITING_PLAYERS && this._hasAvailableSlot();
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

    emit: function (io, event, data) {
        if (data === undefined) {
            io.sockets.in(this.socket_room_name).emit(event);
        } else {
            io.sockets.in(this.socket_room_name).emit(event, data);
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

    setPlayerReady: function(player, isReady) {
        if (this._hasPlayer(player) && this.state === Game.STATE.READY) {
            this.players[player.nickname].isReady = isReady;
            this._updateState();
        }
    },

    _updateState: function () {
        switch (this.state) {
            case Game.STATE.WAITING_PLAYERS:
                if (!this._hasAvailableSlot()) {
                    this.state = Game.STATE.READY;
                }
                break;
            case Game.STATE.READY:
                if (this._hasAvailableSlot()) {
                    this.state = Game.STATE.WAITING_PLAYERS;
                }
                if (this._areAllPlayersReady()) {
                    this.state = Game.STATE.SETTING;
                }
                break;
            case Game.STATE.PLAYING:
                break;
        }
    },

    _areAllPlayersReady: function () {
        for (var nickname in this.players) {
            if (!this.players.hasOwnProperty(nickname)) {
                continue;
            }
            if (!this.players[nickname].isReady) {
                return false;
            }
        }
        return true;
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
