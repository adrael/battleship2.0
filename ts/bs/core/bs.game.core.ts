/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _self: any = null;
        let _gameStarted: boolean = false;
        let _battlefield: any = <any>{};

        export class Game extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public map: bs.core.Map = new bs.core.Map();
            public board: bs.core.Board = new bs.core.Board();
            public ships: Array<bs.ships.AbstractShip> = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                _self = this;

                this.ships = [
                    new bs.ships.Destroyer(this.map),
                    new bs.ships.Submarine(this.map),
                    new bs.ships.Cruiser(this.map),
                    new bs.ships.Battleship(this.map),
                    new bs.ships.Carrier(this.map)
                ];

                _battlefield.$ = $(this.constants.get('canvas').node);
                _battlefield.parent = _battlefield.$.parent();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public start = () : this => {
                if (!_gameStarted) {
                    _gameStarted = true;
                    this.board.drawGrid();
                    _setShips();

                    bs.events.on('BS::SHIP::MOVED', _controlShipsPositions);
                    $(window).on('resize', _resizeCanvas);

                    _battlefield.$.removeClass('hidden');
                    _resizeCanvas();
                }

                return this;
            };

        }

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
                    console.error(exception);
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
                ship.doLocationCheck();
            });

        }

    }

}
