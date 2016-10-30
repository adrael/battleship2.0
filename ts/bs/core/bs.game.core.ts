/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _map: bs.core.Map = null;
        let _gui: bs.core.GUI = null;
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

                console.info('TODO: Create ships depending on server game configuration');
                _board.addShip(new bs.ships.Destroyer());
                _board.addShip(new bs.ships.Submarine());
                _board.addShip(new bs.ships.Cruiser());
                _board.addShip(new bs.ships.Battleship());
                _board.addShip(new bs.ships.Carrier());
                _board.drawShips();

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
                    _board.clearShips();
                    console.info('TODO: Draw player bombs here');
                    _gui.hideOverlay();
                    break;
                case _enum.names.opponent:
                    _board.freezeShips();
                    _board.drawShips();
                    console.info('TODO: Draw opponent bombs here');
                    _gui.showOverlay();
                    break;
            }

            return _instance;
        }

    }

}
