(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window._bs = (window._bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Core = Core;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Core() {

        ///////////////////////
        // MEMBERS
        ///////////////////////

        this.ticker = window._bs._ticker = (window._bs._ticker || new bs.core.Ticker());
        this.constants = window._bs._constants = (window._bs._constants || new bs.core.Constants());
        this.stage = window._bs._stage = (window._bs._stage || new createjs.Stage(this.constants.canvas.node));

        ///////////////////////
        // SETUP
        ///////////////////////

        this.setup();

    }

    Core.prototype.constructor = Core;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Core.prototype.setup = function setup() {
        // Enable touch interactions if supported on the current device:
        createjs.Touch.enable(this.stage);

        // Enable mouse over / out events
        this.stage.enableMouseOver(10);

        // Keep tracking the mouse even when it leaves the canvas
        //this.stage.mouseMoveOutside = true;
    };

    Core.prototype.absoluteToRelativeCoordinates = function absoluteToRelativeCoordinates(absX, absY) {
        return {
            x: Math.floor(absX / this.constants.line.size.width),
            y: Math.floor(absY / this.constants.line.size.height)
        };
    };

    Core.prototype.relativeToAbsoluteCoordinates = function relativeToAbsoluteCoordinates(relX, relY) {
        return {
            x: Math.floor(relX * this.constants.line.size.width),
            y: Math.floor(relY * this.constants.line.size.height)
        };
    };

})();
