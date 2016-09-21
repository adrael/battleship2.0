(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading utils...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.utils.isDate = isDate;
    bs.utils.isNull = isNull;
    bs.utils.isArray = isArray;
    bs.utils.isString = isString;
    bs.utils.isRegExp = isRegExp;
    bs.utils.isObject = isObject;
    bs.utils.isNumber = isNumber;
    bs.utils.isDefined = isDefined;
    bs.utils.isElement = isElement;
    bs.utils.isFunction = isFunction;
    bs.utils.isUndefined = isUndefined;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name isNull
     * @kind function
     *
     * @description
     * Determines if a reference is `null`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is `null`.
     */
    function isNull(value) {
        return value === null && typeof value === 'object';
    }

    /**
     * @name isString
     * @kind function
     *
     * @description
     * Determines if a reference is a `String`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `String`.
     */
    function isString(value) {
        return typeof value === 'string';
    }

    /**
     * @name isUndefined
     * @kind function
     *
     * @description
     * Determines if a reference is undefined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is undefined.
     */
    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    /**
     * @name isDefined
     * @kind function
     *
     * @description
     * Determines if a reference is defined.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is defined.
     */
    function isDefined(value) {
        return typeof value !== 'undefined';
    }

    /**
     * @name isObject
     * @kind function
     *
     * @description
     * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
     * considered to be objects. Note that JavaScript arrays are objects.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Object` but not `null`.
     */
    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    /**
     * @name isNumber
     * @kind function
     *
     * @description
     * Determines if a reference is a `Number`.
     *
     * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
     *
     * If you wish to exclude these then you can use the native
     * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
     * method.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Number`.
     */
    function isNumber(value) {
        return typeof value === 'number';
    }

    /**
     * @name isDate
     * @kind function
     *
     * @description
     * Determines if a value is a date.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Date`.
     */
    function isDate(value) {
        return Object.prototype.toString.call(value) === '[object Date]';
    }

    /**
     * @name isArray
     * @kind function
     *
     * @description
     * Determines if a reference is an `Array`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is an `Array`.
     */
    function isArray(value) {
        return Array.isArray(value);
    }

    /**
     * @name isFunction
     * @kind function
     *
     * @description
     * Determines if a reference is a `Function`.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `Function`.
     */
    function isFunction(value) {
        return typeof value === 'function';
    }

    /**
     * @name isElement
     * @kind function
     *
     * @description
     * Determines if a reference is a DOM element (or wrapped jQuery element).
     *
     * @param {*} node Reference to check.
     * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
     */
    function isElement(node) {
        return !!(node &&
        (node.nodeName  // we are a direct element
        || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
    }

    /**
     * @name isRegExp
     * @kind function
     *
     * @description
     * Determines if a value is a regular expression object.
     *
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/



})();