(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                 CONFIGURATION                                  */
    /*                                                                                */
    /**********************************************************************************/

    console.debug('BATTLESHIP 2.0 - Loading game...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    document.addEventListener('DOMContentLoaded', function() {

        bs.display.drawGrid();
        bs.display.drawIndexes();
        bs.display.drawRandomShips();

    });

})();
