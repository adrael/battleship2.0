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

    function Battleship(map) {
        bs.ships.AbstractShip.call(this);
        this.length = 4;
        this.setMap(map);
        this.setName('BATTLESHIP');
        this.init(window._bs._preload.getResult('BATTLESHIP'));
    }

    Battleship.prototype = bs.ships.AbstractShip.prototype;
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
