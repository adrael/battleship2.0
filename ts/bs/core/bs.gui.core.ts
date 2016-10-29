/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _board: bs.core.Board = null;
        let _instance: any = null;
        let _constants: bs.core.Constants = null;
        let _startGameButton: JQuery = $('#startGame');
        let _sendCommandButton: JQuery = $('#sendCommand');

        export class GUI extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public hitCounter: bs.components.Counter = null;
            public bombCounter: bs.components.Counter = null;
            public shipDestroyedCounter: bs.components.Counter = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;

                    _game = new bs.core.Game();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();

                    _startGameButton.click(_startGame);
                    _sendCommandButton.click(_sendCommand);

                    _instance.hitCounter = new bs.components.Counter(0, '#hits-counter');
                    _instance.bombCounter = new bs.components.Counter(0, '#bombs-counter');
                    _instance.shipDestroyedCounter = new bs.components.Counter(0, '#ship-destroyed-counter');

                    console.info('TODO: Plug hit counter to server response');
                    // bs.events.on(_enum.events.bomb.hit, _instance.hitCounter.increment);
                    // bs.events.on(_enum.events.bomb.dropped, _shotFired);
                    // bs.events.on(_enum.events.bomb.selected, _bombLocationSelected);
                    // bs.events.on(_enum.events.ship.destroyed, _instance.shipDestroyedCounter.increment);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/



        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _shotFired() {
            _instance.bombCounter.increment();
            _sendCommandButton.attr('disabled', 'true');
            return _instance;
        }

        function _bombLocationSelected() {
            _sendCommandButton.removeAttr('disabled');
            return _instance;
        }

        function _sendCommand() {
            // _turn = _enum.names.opponent;
            _sendCommandButton.parent().addClass('hidden');
            // bs.events.broadcast(_enum.events.game.sendCoords);
            // bs.events.broadcast(_enum.events.game.opponentTurn);
            return _instance;
        }

        function _startGame() {
            _startGameButton.parent().addClass('hidden');
            _sendCommandButton.parent().removeClass('hidden');
            _game.start();
            _game.state(_constants.get('enum').names.player);
            _board.draw();
            return _instance;
        }

    }

}
