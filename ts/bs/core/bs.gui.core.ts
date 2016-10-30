/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _game: bs.core.Game = null;
        let _board: bs.core.Board = null;
        let _overlay: JQuery = null;
        let _instance: bs.core.GUI = null;
        let _constants: bs.core.Constants = null;
        let _startGameButton: JQuery = $('#startGame');
        let _sendCommandButton: JQuery = $('#sendCommand');
        let _selectedBombLocation: {x: number, y: number} = null;

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

                    _overlay = $('.overlay');

                    _game = new bs.core.Game();
                    _board = new bs.core.Board();
                    _constants = new bs.core.Constants();

                    _startGameButton.click(_startGame);
                    _sendCommandButton.click(_sendCommand);

                    _instance.hitCounter = new bs.components.Counter(0, '#hits-counter');
                    _instance.bombCounter = new bs.components.Counter(0, '#bombs-counter');
                    _instance.shipDestroyedCounter = new bs.components.Counter(0, '#ship-destroyed-counter');

                    console.info('TODO: Plug hits counter to server response here');
                    console.info('TODO: Plug ships destroyed counter to server response here');
                    // bs.events.on(_enum.events.bomb.hit, _instance.hitCounter.increment);
                    // bs.events.on(_enum.events.ship.destroyed, _instance.shipDestroyedCounter.increment);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public bombLocationSelected = (x: number, y: number) : bs.core.GUI => {
                _sendCommandButton.removeAttr('disabled');
                _selectedBombLocation = {x: x, y: y};
                return _instance;
            };

            public showOverlay = () : bs.core.GUI => {
                if (bs.utils.isElement(_overlay)) {
                    _overlay.removeClass('hidden');
                }
                return _instance;
            };

            public hideOverlay = () : bs.core.GUI => {
                if (bs.utils.isElement(_overlay)) {
                    _overlay.addClass('hidden');
                }
                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _sendCommand() {
            _sendCommandButton.parent().addClass('hidden');
            _sendCommandButton.attr('disabled', 'true');
            _game.sendBombCoordinates(_selectedBombLocation.x, _selectedBombLocation.y);
            _selectedBombLocation = null;
            _instance.bombCounter.increment();
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
