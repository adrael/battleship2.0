(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading core...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.battleship = window.bs = (window.battleship || window.bs || {});

    /**********************************************************************************/
    /*                                                                                */
    /*                                    MEMBERS                                     */
    /*                                                                                */
    /**********************************************************************************/

    bs.map = {};
    bs.ships = [];
    bs.utils = {};
    bs.canvas = {};
    bs.display = {};
    bs.helpers = {};
    bs.constants = {};
    bs.exceptions = {};

})();
