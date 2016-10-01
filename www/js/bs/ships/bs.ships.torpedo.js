(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading TORPEDO...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.ships.push({

        name: 'TORPEDO',
        length: 2,
        sprite: {
            HORIZONTAL: {
                x: 9,
                y: 15,
                width: 436,
                height: 159
            },
            VERTICAL: {
                x: 15,
                y: 559,
                width: 159,
                height: 438
            }
        }

    });

})();
