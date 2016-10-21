(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.ships = (window.bs.ships || {});

    window.bs.ships.Destroyer = Destroyer;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Destroyer(map) {
        bs.ships.AbstractShip.call(this);
        this.length = 2;
        this.setMap(map);
        this.setName('DESTROYER');
        this.init(window._bs._preload.getResult('DESTROYER'));
    }

    Destroyer.prototype = bs.ships.AbstractShip.prototype;
    Destroyer.prototype.constructor = Destroyer;

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
