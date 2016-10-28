/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _update: boolean = false;
        let _tickerUpdateEvent: string = 'BS::GRAPHIC::UPDATE'; // See Constants.events.graphic.update

        export class Ticker {

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
                createjs.Ticker.addEventListener('tick', _notifyClients);
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public requestUpdate = () : this => {
                _update = true;
                return this;
            };

            public notifyOnUpdate = (callback?: any) : any => {
                return bs.events.on(_tickerUpdateEvent, callback);
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _notifyClients(event: Event) {
            // This set makes it so the stage only re-renders when an event handler indicates a change has happened.
            if (_update) {
                _update = false;
                bs.events.broadcast(_tickerUpdateEvent, event)
            }
        }

    }

}
