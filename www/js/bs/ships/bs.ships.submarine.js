(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading SUBMARINE...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.ships.push({

        name: 'SUBMARINE',
        length: 3,
        sprite: {
            HORIZONTAL: {
                x: 16,
                y: 199,
                width: 430,
                height: 79
            },
            VERTICAL: {
                x: 199,
                y: 560,
                width: 79,
                height: 430
            }
        }

    });

})();
