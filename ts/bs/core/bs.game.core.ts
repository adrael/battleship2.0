/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _map: bs.core.Map = null;
        let _gui: bs.core.GUI = null;
        let _ships: Array<bs.ships.AbstractShip> = [];
        let _board: bs.core.Board = null;
        let _instance: bs.core.Game = null;
        let _gameState: string = null;
        let _gameSetup: boolean = null;
        let _constants: bs.core.Constants = null;
        let _gameStarted: boolean = false;
        let _debugEnabled: boolean = true /*__debugEnabled__*/;

        export class Game extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/



            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;

                    _map = new bs.core.Map();
                    _gui = new bs.core.GUI();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public getShips = () : Array<bs.ships.AbstractShip> => {
                return _ships;
            };

            public start = () : bs.core.Game => {
                _gameStarted = true;
                return _instance;
            };

            public setup = () : bs.core.Game => {
                if (_gameSetup) {
                    console.error('The game has already started!');
                    return _instance;
                }

                _gameSetup = true;

                console.info('TODO: Set state according to who starts first (from server)');
                _instance.state(_constants.get('enum').names.player);

                _board.setup();
                _shipsSetup();

                return _instance;
            };

            public state = (gameState?: string) : bs.core.Game | string => {
                if (bs.utils.isUndefined(gameState)) {
                    return _gameState;
                }

                _gameState = gameState;
                _stateChanged();
                _board.draw();

                return _instance;
            };

            public hasStarted = () : boolean => {
                return _gameStarted;
            };

            public hasDebugEnabled = () : boolean => {
                return _debugEnabled;
            };

            public sendBombCoordinates = (x: number, y: number) : bs.core.Game => {
                let _enum = _constants.get('enum');
                if (this.state() !== _enum.names.player) {
                    return _instance;
                }
                console.info('TODO: Send bomb coordinates to server here');
                _map.savePlayerBombLocation(x, y);
                this.state(_enum.names.opponent);
                return _instance;
            };

            public shipMoved = (ship?: bs.ships.AbstractShip) : bs.core.Game => {
                bs.utils.forEach(_ships, _ship => _ship.doLocationCheck());
                _board.requestUpdate();
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _stateChanged() : bs.core.Game {

            let _enum = _constants.get('enum');
            switch (_gameState) {
                case _enum.names.player:
                    _clearShips();
                    console.info('TODO: Draw player bombs here');
                    _gui.hideOverlay();
                    break;
                case _enum.names.opponent:
                    _drawShips(true);
                    console.info('TODO: Draw opponent bombs here');
                    _gui.showOverlay();
                    break;
            }

            return _instance;

        }

        function _drawShips(frozen: boolean = false) : bs.core.Game {
            bs.utils.forEach(_ships, ship => {
                if (frozen) {
                    ship.freeze();
                }
                ship.draw();
            });
            return _instance;
        }

        function _clearShips() : bs.core.Game {
            bs.utils.forEach(_ships, ship => ship.clear());
            return _instance;
        }

        function _shipsSetup() : bs.core.Game {
            console.info('TODO: Create ships depending on server game configuration');
            _ships = [
                new bs.ships.Destroyer(),
                new bs.ships.Submarine(),
                new bs.ships.Cruiser(),
                new bs.ships.Battleship(),
                new bs.ships.Carrier()
            ];

            bs.utils.forEach(_ships, ship => {
                try {
                    let freeCoordinates = _map.getFreeCoordinates(ship.orientation, ship.length);
                    ship.setLocation(freeCoordinates.x, freeCoordinates.y);
                    ship.draw();
                }
                catch (exception) {
                    console.error(exception);
                    //console.error('Cannot place ship:', ship);
                }
            });

            return _instance;
        }

    }

}
