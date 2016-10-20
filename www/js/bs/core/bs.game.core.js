(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Game = Game;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _self = null,
        _gameStarted = false,
        _battlefield = {};

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Game() {

        _self = this;

        _self.map = new bs.core.Map();
        _self.board = new bs.core.Board();
        _self.ships = [
            new bs.ships.Destroyer(_self.map),
            new bs.ships.Submarine(_self.map),
            new bs.ships.Cruiser(_self.map),
            new bs.ships.Battleship(_self.map),
            new bs.ships.Carrier(_self.map)
        ];

        _battlefield.$ = $(_self.constants.canvas.node);
        _battlefield.parent = _battlefield.$.parent();

    }

    Game.prototype = new bs.core.Core();
    Game.prototype.constructor = Game;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Game.prototype.start = function start() {

        if (!_gameStarted) {

            _gameStarted = true;
            _self.board.drawGrid();
            _setShips();

            bs.events.on('BS::SHIP::MOVED', _controlShipsPositions);
            $(window).on('resize', _resizeCanvas);

            _battlefield.$.removeClass('hidden');
            _resizeCanvas();

        }

        return this;

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _controlShipsPositions() {
        bs.utils.forEach(_self.ships, function (ship) {
            ship.doLocationCheck();
            _self.ticker.requestUpdate();
        });
    }

    function _setShips() {
        bs.utils.forEach(_self.ships, function (ship) {
            try {
                var freeCoordinates = _self.map.getFreeCoordinates(ship.orientation, ship.length);
                ship.location.x = freeCoordinates.x;
                ship.location.y = freeCoordinates.y;

                _self.map.addShip(ship);
                ship.draw();
            }
            catch (exception) {
                console.log(exception);
                //console.error('Cannot place ship:', ship);
            }
        });
    }

    function _resizeCanvas() {

        var __width = _battlefield.parent.width(),
            __height = _battlefield.parent.height(),
            _width = __width * .9,
            _height = __height * .9,
            size = (_width <= _height ? _width : _height),
            marginTop = (__height - size) / 2,
            marginLeft = (__width - size) / 2;

        _battlefield.$.css('margin-top', marginTop);
        _battlefield.$.css('margin-left', marginLeft);

        _self.stage.canvas.width = size;
        _self.stage.canvas.height = size;

        bs.events.broadcast('BS::WINDOW::RESIZED');

        _self.board.drawGrid();

        bs.utils.forEach(_self.ships, function (ship) {
            ship.draw();
        });

    }

})();
