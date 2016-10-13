(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    document.addEventListener('DOMContentLoaded', function() {

        var board = new bs.graphics.Board();

        board.drawGrid();

        new bs.ships.Submarine().load();

        //bs.display.drawBoard();
        //bs.display.drawRandomShips();
        //bs.display.setInterface();

    });

})();
