(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.display.setInterface = setInterface;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function setInterface() {

        bs.constants.CANVAS.CANVAS.onclick = function (e) {
            var clickedX = e.pageX - this.offsetLeft,
                clickedY = e.pageY - this.offsetTop,
                coordinates = bs.map.absoluteToRelativeCoordinates(clickedX, clickedY);

            bs.events.broadcast(bs.constants.EVENTS.ONCLICK, coordinates);
        };

    }

})();
