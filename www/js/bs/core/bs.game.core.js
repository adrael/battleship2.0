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
        _gameStarted = false;

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

            bs.events.on('BS::SHIP::MOVED', _controlShipsPositions)

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



})();
