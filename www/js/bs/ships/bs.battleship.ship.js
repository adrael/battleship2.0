(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.ships = (window.bs.ships || {});

    window.bs.ships.Battleship = Battleship;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Battleship(template, x, y) {

        this.length = 4;
        this.setName('BATTLESHIP');
        this.init(template || window._bs._preload.getResult('BATTLESHIP'), x, y);

    }

    Battleship.prototype = new bs.ships.Ship();
    Battleship.prototype.constructor = Battleship;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



})();
