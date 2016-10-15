(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.exceptions = (window.bs.exceptions || {});

    window.bs.exceptions.BSInvalidValueException = BSInvalidValueException;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name BSInvalidValueException
     * @kind Exception
     *
     * @description
     * Use this exception when the value of a property is not matching required specifications.
     *
     * @param {*} value The invalid property's value.
     * @param {String} property The invalid property's name.
     */
    function BSInvalidValueException(value, property) {
        this.name = 'BSInvalidValueException';
        this.stack = (new Error()).stack;
        this.toString = function () { return this.name + ': ' + this.message; };
        this.message = 'Encountered invalid value: ' + value;

        if (bs.utils.isString(property) && property.trim().length) {
            this.message = 'Property `' + property + '` has an invalid value: `' + value + '`';
        }
    }

    BSInvalidValueException.prototype = Object.create(window.bs.exceptions.BSFactoryException.prototype);
    BSInvalidValueException.prototype.constructor = BSInvalidValueException;

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
