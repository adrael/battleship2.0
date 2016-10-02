(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    var _listeners = {};

    bs.events.on = on;
    bs.events.get = get;
    bs.events.flush = flush;
    bs.events.broadcast = broadcast;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function on(name, listener) {

        if (!bs.utils.isFunction(listener)) return;

        var namedListeners = _listeners[name];
        if (!namedListeners) {
            _listeners[name] = namedListeners = [];
        }
        namedListeners.push(listener);

        return function _off() {
            var indexOfListener = namedListeners.indexOf(listener);
            if (indexOfListener !== -1) {
                namedListeners.splice(indexOfListener, 1);
            }
        };

    }

    function flush() {
        _listeners = {};
    }

    function get(name) {
        return _listeners[name] || null;
    }

    function broadcast(name, args) {

        var namedListeners = _listeners[name];
        if (!namedListeners) return;

        bs.helpers.forEach(namedListeners, function (listener) {
            try { listener.apply(null, [args]); }
            catch (exception) { bs.helpers.handleException(exception); }
        });

    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

})();
