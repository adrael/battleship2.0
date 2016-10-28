/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _self: any = null;
        let _enum: any = null;
        let _overlay: JQuery = $('.overlay');
        let _battlefield: any = <any>{};
        let _gameStarted: boolean = false;

        export class Game extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public map: bs.core.Map = new bs.core.Map();
            public gui: bs.core.GUI = new bs.core.GUI();
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
                _enum = this.constants.get('enum');

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
                    _drawShips();

                    bs.events.on(_enum.events.ship.moved, _controlShipsPositions);
                    bs.events.on(_enum.events.game.playerTurn, _proceedToPlayerTurn);
                    bs.events.on(_enum.events.game.opponentTurn, _proceedToOpponentTurn);
                    bs.events.on(_enum.events.bomb.selected, coords => {
                        console.log('hit coords:', coords);
                    });
                    bs.events.on(_enum.events.game.sendCoords, () => {
                        console.log('Send coords to WS here');
                        bs.events.broadcast(_enum.events.bomb.hit);
                    });

                    $(window).on('resize', _resizeCanvas);

                    _battlefield.$.removeClass('hidden');
                    _resizeCanvas();

                    this.gui.setup();
                }

                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _proceedToPlayerTurn() {
            _clearShips();
            _overlay.addClass('hidden');
            return _self;
        }

        function _proceedToOpponentTurn() {
            _drawShips();
            _overlay.removeClass('hidden');
            return _self;
        }

        function _controlShipsPositions() {
            bs.utils.forEach(_self.ships, ship => {
                ship.doLocationCheck();
            });
            _self.ticker.requestUpdate();
            return _self;
        }

        function _setShips() {
            bs.utils.forEach(_self.ships, ship => {
                try {
                    var freeCoordinates = _self.map.getFreeCoordinates(ship.orientation, ship.length);
                    ship.location.x = freeCoordinates.x;
                    ship.location.y = freeCoordinates.y;

                    _self.map.addShip(ship);
                }
                catch (exception) {
                    console.error(exception);
                    //console.error('Cannot place ship:', ship);
                }
            });
            return _self;
        }

        function _drawShips() {
            bs.utils.forEach(_self.ships, ship => {
                ship.draw();
            });
            return _self;
        }

        function _clearShips() {
            bs.utils.forEach(_self.ships, ship => {
                ship.clear();
            });
            return _self;
        }

        function _resizeCanvas() {

            var __width = _battlefield.parent.width(),
                __height = _battlefield.parent.height(),
                _width = __width * .9,
                _height = __height * .9,
                size = (_width <= _height ? _width : _height),
                marginTop = (__height - size) / 2,
                marginLeft = (__width - size) / 2;

            _battlefield.$.css('margin-top', (_width > 384) ? marginTop : 0);
            _battlefield.$.css('margin-left', marginLeft);

            _self.stage.canvas.width = size;
            _self.stage.canvas.height = size;

            bs.events.broadcast(_enum.events.window.resized);

            _self.board.drawGrid();

            bs.utils.forEach(_self.ships, ship => {
                ship.draw();
                ship.doLocationCheck();
            });

            return _self;

        }

    }

}
