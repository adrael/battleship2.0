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
        // CONSTANTS
        ///////////////////////

        this.constants = {};

        this.constants.canvas = {};
        this.constants.canvas.node = document.getElementById('battlefield');
        this.constants.canvas.size = {};
        this.constants.canvas.size.width = 100;
        this.constants.canvas.size.height = 100;

        if (this.constants.canvas.node) {
            this.constants.canvas.size.width = this.constants.canvas.node.scrollWidth;
            this.constants.canvas.size.height = this.constants.canvas.node.scrollHeight;
        }

        this.constants.orientation = {};
        this.constants.orientation.vertical = 'VERTICAL';
        this.constants.orientation.horizontal = 'HORIZONTAL';

        this.constants.colors = {};
        this.constants.colors.red = '#FF5E5B';
        this.constants.colors.white = '#F8F8FF';
        this.constants.colors.black = '#36393B';

        this.constants.line = {};
        this.constants.line.count =  11;
        this.constants.line.size = {};
        this.constants.line.size.width =  (this.constants.canvas.size.width / this.constants.line.count);
        this.constants.line.size.height =  (this.constants.canvas.size.height / this.constants.line.count);

        this.constants.map = {};
        this.constants.map.gap = 1;
        this.constants.map.indexes = {};
        this.constants.map.indexes.vertical = 'A,B,C,D,E,F,G,H,I,J'.split(',');
        this.constants.map.indexes.horizontal = '1,2,3,4,5,6,7,8,9,10'.split(',');

        ///////////////////////
        // MEMBERS
        ///////////////////////

        this.stage = window._bs._stage = (window._bs._stage || new createjs.Stage(this.constants.canvas.node));
        this.ticker = window._bs._ticker = (window._bs._ticker || new bs.core.Ticker());

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
        this.stage.mouseMoveOutside = true;

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
