(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.exceptions = (window.bs.exceptions || {});

    window.bs.exceptions.BSFactoryException = BSFactoryException;
    window.bs.exceptions.BSInvalidValueException = BSInvalidValueException;
    window.bs.exceptions.BSMissingPropertyException = BSMissingPropertyException;
    window.bs.exceptions.BSInvalidCoordinatesException = BSInvalidCoordinatesException;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  EXCEPTIONS                                    */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name BSFactoryException
     * @kind Exception
     *
     * @description
     * The factory exception to inherit from.
     */
    function BSFactoryException() {
        this.name = 'BSFactoryException';
        this.stack = (new Error()).stack;
        this.toString = function () { return this.name + ': ' + this.message; };
        this.message = 'An error occured.';
    }

    BSFactoryException.prototype = Object.create(Error.prototype);
    BSFactoryException.prototype.constructor = BSFactoryException;

    /**
     * @name BSMissingPropertyException
     * @kind Exception
     *
     * @description
     * Use this exception when a property or parameter is missing from a function's call.
     *
     * @param {String} property The missing property's name.
     * @param {Array} requiredProperties Array containing all the required properties for the given call.
     */
    function BSMissingPropertyException(property, requiredProperties) {
        this.name = 'BSMissingPropertyException';
        this.stack = (new Error()).stack;
        this.toString = function () { return this.name + ': ' + this.message; };
        this.message = 'A property is missing.';

        if (bs.utils.isString(property) && property.trim().length) {
            this.message = 'Missing `' + property + '` property.';
        }

        if (bs.utils.isArray(requiredProperties) && requiredProperties.length) {
            this.message += ' Required properties are: [' + requiredProperties.join(', ') + ']';
        }
    }

    BSMissingPropertyException.prototype = Object.create(BSFactoryException.prototype);
    BSMissingPropertyException.prototype.constructor = BSMissingPropertyException;

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

    BSInvalidValueException.prototype = Object.create(BSFactoryException.prototype);
    BSInvalidValueException.prototype.constructor = BSInvalidValueException;

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

    BSInvalidCoordinatesException.prototype = Object.create(BSFactoryException.prototype);
    BSInvalidCoordinatesException.prototype.constructor = BSInvalidCoordinatesException;

})();
