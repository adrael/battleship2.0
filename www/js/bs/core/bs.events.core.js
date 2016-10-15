(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.events = (window.bs.events || {});

    window.bs.events.on = on;
    window.bs.events.get = get;
    window.bs.events.flush = flush;
    window.bs.events.broadcast = broadcast;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _listeners = {};

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

        bs.utils.forEach(namedListeners, function (listener) {
            try { listener.apply(null, [args]); }
            catch (exception) { bs.utils.handleException(exception); }
        });

    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

})();
