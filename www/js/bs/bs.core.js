(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.Core = Core;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Core() {

        ///////////////////////
        // CONSTANTS
        ///////////////////////

        this.canvas = {};
        this.canvas.node = document.getElementById('battlefield');
        this.canvas.size = {};
        this.canvas.size.width = 100;
        this.canvas.size.height = 100;

        if (this.canvas.node) {
            this.canvas.size.width = this.canvas.node.scrollWidth;
            this.canvas.size.height = this.canvas.node.scrollHeight;
        }

        this.sprites = {};
        this.sprites.vertical = 'img/ships_vertical_sprite.png';
        this.sprites.horizontal = 'img/ships_horizontal_sprite.png';

        this.orientation = {};
        this.orientation.vertical = 'VERTICAL';
        this.orientation.horizontal = 'HORIZONTAL';

        this.colors = {};
        this.colors.red = '#FF5E5B';
        this.colors.white = '#F8F8FF';
        this.colors.black = '#36393B';

        this.line = {};
        this.line.count =  11;
        this.line.size = {};
        this.line.size.width =  (this.canvas.size.width / this.line.count);
        this.line.size.height =  (this.canvas.size.height / this.line.count);

        this.map = {};
        this.map.gap = 1;
        this.map.indexes = {};
        this.map.indexes.vertical = 'A,B,C,D,E,F,G,H,I,J'.split(',');
        this.map.indexes.horizontal = '1,2,3,4,5,6,7,8,9,10'.split(',');

        ///////////////////////
        // MEMBERS
        ///////////////////////

        this.stage = new createjs.Stage(this.canvas.node);

    }

    Core.prototype.constructor = Core;

    /**********************************************************************************/
    /*                                                                                */
    /*                                    MEMBERS                                     */
    /*                                                                                */
    /**********************************************************************************/



})();
