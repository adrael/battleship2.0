(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading helpers...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.helpers.noop = noop;
    bs.helpers.merge = merge;
    bs.helpers.extend = extend;
    bs.helpers.forEach = forEach;
    bs.helpers.validObject = validObject;
    bs.helpers.handleException = handleException;
    bs.helpers.printBSException = printBSException;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name noop
     * @kind function
     *
     * @description
     * A function that performs no operations. This function can be useful when writing code in the
     * functional style.
     */
    function noop() {}

    /**
     * @name handleException
     * @kind function
     *
     * @description
     * Properly handles the given exception to display useful information.
     *
     * @param {Object} exception The raised exception to be handled.
     */
    function handleException(exception) {

        if (exception instanceof bs.exceptions.BSFactoryException) {
            return bs.helpers.printBSException(exception);
        }

        console.error(exception);

    }

    /**
     * @name extractInfoFromStack
     * @kind function
     *
     * @description
     * Parses and extracts data from a given error stack.
     *
     * @param {Object} stack The stack object to get data from.
     * @returns {Array} The extracted data.
     */
    function extractInfoFromStack(stack) {

        var splitStack = (stack || '').toString().split(/\r\n|\n/),
            result = [];

        forEach(splitStack, function (line) {
            var info = line.trim().split(' ');
            result.push({
                name: (info[1] || 'anonymous_function'),
                location: (info[2] || 'unknown').replace(/\(|\)/g, '')
            });
        });

        return result;

    }

    /**
     * @name printBSException
     * @kind function
     *
     * @description
     * Pretty prints an error or an exception for debug purposes.
     *
     * @param {Object} exception Error/exception object.
     */
    function printBSException(exception) {

        if (exception instanceof Error) {

            var prettyStack = extractInfoFromStack(exception.stack),
                toFn = prettyStack[prettyStack.length - 2],
                fromFn = prettyStack[prettyStack.length - 1];

            if (prettyStack.length >= 2) {
                return console.error(
                    'Error:', exception.message, '\n',
                    'Caller:', fromFn.name, '[' + fromFn.location + ']', '\n',
                    'Callee:', toFn.name, '[' + toFn.location + ']'
                );
            }

        }

        console.error(exception || 'Unknown, unpredicted exception occured.');

    }

    /**
     * @name validObject
     * @kind function
     *
     * @description
     * Parses the given object and validate each of its properties against the selected array of properties.
     *
     * @param {Object} object Source object.
     * @param {Array} requiredProperties Required properties.
     */
    function validObject(object, requiredProperties) {
        forEach(requiredProperties, function (property) {
            if (!object.hasOwnProperty(property)) {
                throw new bs.exceptions.BSMissingPropertyException(property, requiredProperties);
            }

            if (bs.utils.isUndefined(object[property]) || bs.utils.isNull(object[property])) {
                throw new bs.exceptions.BSInvalidValueException(object[property], property);
            }
        });
    }

    /**
     * @name extend
     * @kind function
     *
     * @description
     * Extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
     * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
     * by passing an empty object as the target: `var object = extend({}, object1, object2)`.
     *
     * **Note:** Keep in mind that `extend` does not support recursive merge (deep copy). Use
     * {@link merge} for this.
     *
     * @param {Object} dst Destination object.
     * @param {...Object} src Source object(s).
     * @returns {Object} Reference to `dst`.
     */
    function extend(dst) {
        return _baseExtend(dst, [].slice.call(arguments, 1), false);
    }


    /**
     * @name merge
     * @kind function
     *
     * @description
     * Deeply extends the destination object `dst` by copying own enumerable properties from the `src` object(s)
     * to `dst`. You can specify multiple `src` objects. If you want to preserve original objects, you can do so
     * by passing an empty object as the target: `var object = merge({}, object1, object2)`.
     *
     * Unlike {@link extend extend()}, `merge()` recursively descends into object properties of source
     * objects, performing a deep copy.
     *
     * @param {Object} dst Destination object.
     * @param {...Object} src Source object(s).
     * @returns {Object} Reference to `dst`.
     */
    function merge(dst) {
        return _baseExtend(dst, [].slice.call(arguments, 1), true);
    }

    /**
     * @name forEach
     * @kind function
     *
     * @description
     * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
     * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
     * is the value of an object property or an array element, `key` is the object property key or
     * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
     *
     * It is worth noting that `forEach` does not iterate over inherited properties because it filters
     * using the `hasOwnProperty` method.
     *
     * Unlike ES262's
     * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
     * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
     * return the value provided.
     *
     * @param {Object|Array} obj Object to iterate over.
     * @param {Function} iterator Iterator function.
     * @param {Object=} context Object to become context (`this`) for the iterator function.
     * @returns {Object|Array} Reference to `obj`.
     */
    function forEach(obj, iterator, context) {

        var key, length;

        if (obj) {

            if (bs.utils.isFunction(obj)) {

                for (key in obj) {
                    if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }

            } else if (bs.utils.isArray(obj) || _isArrayLike(obj)) {

                var isPrimitive = typeof obj !== 'object';
                for (key = 0, length = obj.length; key < length; key++) {
                    if (isPrimitive || key in obj) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }

            } else if (obj.forEach && obj.forEach !== forEach) {

                obj.forEach(iterator, context, obj);

            } else if (_isBlankObject(obj)) {

                // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
                for (key in obj) {
                    iterator.call(context, obj[key], key, obj);
                }

            } else if (typeof obj.hasOwnProperty === 'function') {

                // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }

            } else {

                // Slow path for objects which do not have a method `hasOwnProperty`
                for (key in obj) {
                    if (hasOwnProperty.call(obj, key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }

            }
        }

        return obj;

    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name _baseExtend
     * @kind function
     *
     * @description
     * Base for `merge` and `extend` functions
     */
    function _baseExtend(dst, objs, deep) {

        for (var i = 0, ii = objs.length; i < ii; ++i) {

            var obj = objs[i];

            if (!bs.utils.isObject(obj) && !bs.utils.isFunction(obj)) continue;

            var keys = Object.keys(obj);

            for (var j = 0, jj = keys.length; j < jj; j++) {

                var key = keys[j];
                var src = obj[key];

                if (deep && bs.utils.isObject(src)) {

                    if (bs.utils.isDate(src)) {
                        dst[key] = new Date(src.valueOf());
                    } else if (bs.utils.isRegExp(src)) {
                        dst[key] = new RegExp(src);
                    } else if (src.nodeName) {
                        dst[key] = src.cloneNode(true);
                    } else if (bs.utils.isElement(src)) {
                        dst[key] = src.clone();
                    } else {
                        if (!bs.utils.isObject(dst[key])) dst[key] = bs.utils.isArray(src) ? [] : {};
                        _baseExtend(dst[key], [src], true);
                    }

                } else {

                    dst[key] = src;

                }

            }

        }

        return dst;

    }

    /**
     * @name _isArrayLike
     * @kind function
     *
     * @description
     * Returns true if `obj` is an array or array-like object (NodeList, Arguments, String ...)
     */
    function _isArrayLike(obj) {

        // `null`, `undefined` and `window` are not array-like
        if (obj == null || _isWindow(obj)) return false;

        // arrays, strings and jQuery/jqLite objects are array like
        // * jqLite is either the jQuery or jqLite constructor function
        // * we have to check the existence of jqLite first as this method is called
        //   via the forEach method when constructing the jqLite object in the first place
        if (bs.utils.isArray(obj) || bs.utils.isString(obj)) return true;

        // Support: iOS 8.2 (not reproducible in simulator)
        // "length" in obj used to prevent JIT error (gh-11508)
        var length = 'length' in Object(obj) && obj.length;

        // NodeList objects (with `item` method) and
        // other objects with suitable length characteristics are array-like
        return bs.utils.isNumber(length) &&
            (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function');

    }

    /**
     * @name _isArrayLike
     * @kind function
     *
     * @description
     * Checks if `obj` is a window object.
     */
    function _isWindow(obj) {
        return obj && obj.window === obj;
    }

    /**
     * @name _isBlankObject
     * @kind function
     *
     * @description
     * Determine if a value is an object with a null prototype
     */
    function _isBlankObject(value) {
        return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
    }

})();
