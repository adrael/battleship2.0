(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Constants = Constants;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/



    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Constants() {

        this.update();
        bs.events.on('BS::WINDOW::RESIZED', this.update.bind(this));

    }

    Constants.prototype.constants = {};
    Constants.prototype.constructor = Constants;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Constants.prototype.update = function update() {

        Constants.prototype.canvas = {};
        Constants.prototype.canvas.node = document.getElementById('battlefield');
        Constants.prototype.canvas.size = {};
        Constants.prototype.canvas.size.width = 600;
        Constants.prototype.canvas.size.height = 600;

        if (Constants.prototype.canvas.node) {
            Constants.prototype.canvas.size.width = Constants.prototype.canvas.node.scrollWidth;
            Constants.prototype.canvas.size.height = Constants.prototype.canvas.node.scrollHeight;
        }

        Constants.prototype.orientation = {};
        Constants.prototype.orientation.vertical = 'VERTICAL';
        Constants.prototype.orientation.horizontal = 'HORIZONTAL';

        Constants.prototype.colors = {};
        Constants.prototype.colors.red = '#FF5E5B';
        Constants.prototype.colors.white = '#F8F8FF';
        Constants.prototype.colors.black = '#36393B';

        Constants.prototype.line = {};
        Constants.prototype.line.count =  11;
        Constants.prototype.line.size = {};
        Constants.prototype.line.size.width =  (Constants.prototype.canvas.size.width / Constants.prototype.line.count);
        Constants.prototype.line.size.height =  (Constants.prototype.canvas.size.height / Constants.prototype.line.count);

        Constants.prototype.map = {};
        Constants.prototype.map.gap = 1;
        Constants.prototype.map.indexes = {};
        Constants.prototype.map.indexes.vertical = 'A,B,C,D,E,F,G,H,I,J'.split(',');
        Constants.prototype.map.indexes.horizontal = '1,2,3,4,5,6,7,8,9,10'.split(',');

        if(/*__debugEnabled__*/ true /*__debugEnabled__*/) {
            Constants.prototype.map.indexes.vertical = '1,2,3,4,5,6,7,8,9,10'.split(',');
        }
        return this;

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



})();
