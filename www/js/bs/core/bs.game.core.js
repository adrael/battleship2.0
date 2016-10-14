(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});

    window.bs.Game = Game;

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

        _self.map = new bs.logics.Map();
        _self.board = new bs.graphics.Board();
        _self.ships = [
            new bs.ships.Destroyer(window._SUBMARINE),
            new bs.ships.Submarine(window._SUBMARINE),
            new bs.ships.Cruiser(window._SUBMARINE),
            new bs.ships.Battleship(window._SUBMARINE),
            new bs.ships.Carrier(window._SUBMARINE)
        ];

    }

    Game.prototype = new bs.Core();
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

            //bs.display.drawBoard();
            //bs.display.drawRandomShips();
            //bs.display.setInterface();

        }

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _setShips() {

        bs.utils.forEach(_self.ships, function (ship) {

            try {

                ship.orientation =
                    ((Math.random() * 100) > 50 ?
                        _self.constants.orientation.horizontal : _self.constants.orientation.vertical);

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
