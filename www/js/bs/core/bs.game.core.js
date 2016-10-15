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
            new bs.ships.Destroyer(),
            new bs.ships.Submarine(),
            new bs.ships.Cruiser(),
            new bs.ships.Battleship(),
            new bs.ships.Carrier()
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

        }

        return this;

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _setShips() {

        bs.utils.forEach(_self.ships, function (ship) {

            try {

                // The ship is horizontal by default
                // See bs.abstract.ship constructor
                if ((Math.random() * 100) > 50) {
                    ship.orientation = _self.constants.orientation.vertical;
                }

                var freeCoordinates = _self.map.getFreeCoordinates(ship.orientation, ship.length);
                ship.location.x = freeCoordinates.x;
                ship.location.y = freeCoordinates.y;

                _self.map.addShip(ship);
                _self.board.drawShip(ship);

            }
            catch (exception) {
                console.log(exception);
                console.error('Cannot place ship:', ship);
            }

        });

    }



})();
