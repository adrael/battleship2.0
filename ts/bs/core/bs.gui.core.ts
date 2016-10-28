/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _enum: any = null;
        let _turn: string = null;
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
                _enum = this.constants.get('enum');
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public setup = () : this => {

                _startGameButton.click(_startGame);
                _sendCommandButton.click(_sendCommand);

                this.hitCounter = new bs.components.Counter(0, '#hits-counter');
                this.bombCounter = new bs.components.Counter(0, '#bombs-counter');
                this.shipDestroyedCounter = new bs.components.Counter(0, '#ship-destroyed-counter');

                bs.events.on(_enum.events.bomb.hit, this.hitCounter.increment);
                bs.events.on(_enum.events.bomb.dropped, this.bombCounter.increment);
                bs.events.on(_enum.events.ship.destroyed, this.shipDestroyedCounter.increment);

                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _sendCommand() {
            _turn = _enum.names.opponent;
            _sendCommandButton.parent().addClass('hidden');
            bs.events.broadcast(_enum.events.game.sendCoords);
            bs.events.broadcast(_enum.events.game.opponentTurn);
        }

        function _startGame() {
            _startGameButton.parent().addClass('hidden');
            _sendCommandButton.parent().removeClass('hidden');
            _turn = _enum.names.player;
            bs.events.broadcast(_enum.events.game.started);
            bs.events.broadcast(_enum.events.game.playerTurn);
        }

    }

}
