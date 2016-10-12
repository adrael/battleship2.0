(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    document.addEventListener('DOMContentLoaded', function() {

        var board = new bs.graphic.Board();

        board.drawGrid();

        //bs.display.drawBoard();
        //bs.display.drawRandomShips();
        //bs.display.setInterface();

    });

})();
