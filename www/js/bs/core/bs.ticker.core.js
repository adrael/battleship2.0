(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Ticker = Ticker;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _self = null,
        _update = false,
        _tickerUpdateEvent = 'BS::TICKER::UPDATE';

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Ticker() {

        _self = this;
        createjs.Ticker.addEventListener('tick', _notifyClients);

    }

    Ticker.prototype.constructor = Ticker;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Ticker.prototype.requestUpdate = function requestUpdate() {
        _update = true;
    };

    Ticker.prototype.notifyOnUpdate = function notifyOnUpdate(callback) {
        return bs.events.on(_tickerUpdateEvent, callback);
    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _notifyClients(event) {

        // This set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (_update) {
            _update = false;
            bs.events.broadcast(_tickerUpdateEvent, event)
        }

    }



})();
