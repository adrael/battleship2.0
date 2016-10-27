/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _setup: boolean = false;

        export class Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            public UUID: string = null;
            public stage: createjs.Stage = null;
            public ticker: bs.core.Ticker = null;
            public constants: bs.core.Constants = null;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                this.UUID = bs.utils.uuid();
                this.ticker = bs._data.ticker = (bs._data.ticker || new bs.core.Ticker());
                this.constants = bs._data.constants = (bs._data.constants || new bs.core.Constants());
                this.stage = bs._data.stage = (bs._data.stage || new createjs.Stage(this.constants.get('canvas').node));
                this.setup();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public setup = () : this => {
                if (!_setup) {
                    _setup = true;

                    // Enable touch interactions if supported on the current device:
                    createjs.Touch.enable(this.stage);

                    // Enable mouse over / out events
                    this.stage.enableMouseOver(10);

                    // Keep tracking the mouse even when it leaves the canvas
                    this.stage.mouseMoveOutside = true;
                }

                return this;
            };

            public absoluteToRelativeCoordinates = (absX: number, absY: number) : any => {
                return {
                    x: Math.floor(absX / this.constants.get('line').size.width),
                    y: Math.floor(absY / this.constants.get('line').size.height)
                };
            };

            public relativeToAbsoluteCoordinates = (relX: number, relY: number) : any => {
                return {
                    x: Math.floor(relX * this.constants.get('line').size.width),
                    y: Math.floor(relY * this.constants.get('line').size.height)
                };
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
