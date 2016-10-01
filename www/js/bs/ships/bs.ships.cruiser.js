(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading CRUISER...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.ships.push({

        name: 'CRUISER',
        length: 3,
        sprite: {
            HORIZONTAL: {
                x: 18,
                y: 290,
                width: 418,
                height: 127
            },
            VERTICAL: {
                x: 290,
                y: 570,
                width: 127,
                height: 418
            }
        }

    });

})();
