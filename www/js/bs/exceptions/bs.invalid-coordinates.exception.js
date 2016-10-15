(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.exceptions = (window.bs.exceptions || {});

    window.bs.exceptions.BSInvalidCoordinatesException = BSInvalidCoordinatesException;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name BSInvalidCoordinatesException
     * @kind Exception
     *
     * @description
     * Use this exception when invalid coordinates are spotted to be read or written on the map.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     */
    function BSInvalidCoordinatesException(x, y) {
        this.name = 'BSInvalidCoordinatesException';
        this.stack = (new Error()).stack;
        this.toString = function () { return this.name + ': ' + this.message; };
        this.message = 'Encountered invalid coordinates';

        if (bs.utils.isNumber(x) && bs.utils.isNumber(y)) {
            this.message = 'Encountered invalid coordinates: (' + x + ', ' + y + ')';
        }
    }

    BSInvalidCoordinatesException.prototype = Object.create(window.bs.exceptions.BSFactoryException.prototype);
    BSInvalidCoordinatesException.prototype.constructor = BSInvalidCoordinatesException;

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
