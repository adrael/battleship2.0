/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        export class Interface {

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

            constructor() {}

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public setup = () : this => {

                $('#playerTurn').click(() => { bs.events.broadcast('BS::TURN::PLAYER'); });
                $('#opponentTurn').click(() => { bs.events.broadcast('BS::TURN::OPPONENT'); });

                this.hitCounter = new bs.components.Counter(0, '#hits-counter');
                this.bombCounter = new bs.components.Counter(0, '#bombs-counter');
                this.shipDestroyedCounter = new bs.components.Counter(0, '#ship-destroyed-counter');

                bs.events.on('BS::BOMB::HIT', this.hitCounter.increment);
                bs.events.on('BS::BOMB::DROPPED', this.bombCounter.increment);
                bs.events.on('BS::SHIP::DESTROYED', this.shipDestroyedCounter.increment);

                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
