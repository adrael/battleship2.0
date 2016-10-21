(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.ships = (window.bs.ships || {});

    window.bs.ships.Submarine = Submarine;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Submarine(map) {
        bs.ships.AbstractShip.call(this);
        this.length = 3;
        this.setMap(map);
        this.setName('SUBMARINE');
        this.init(window._bs._preload.getResult('SUBMARINE'));
    }

    Submarine.prototype = bs.ships.AbstractShip.prototype;
    Submarine.prototype.constructor = Submarine;

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
