(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading constants...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.constants.COLORS = {};
    bs.constants.COLORS.RED = '#FF5E5B';
    bs.constants.COLORS.WHITE = '#f8f8ff';
    bs.constants.COLORS.BLACK = '#36393B';

    bs.constants.CANVAS = {};
    bs.constants.CANVAS.CANVAS = document.getElementById('battlefield-container');
    bs.constants.CANVAS.CONTEXT = bs.constants.CANVAS.CANVAS.getContext('2d');
    bs.constants.CANVAS.SIZE = {};
    bs.constants.CANVAS.SIZE.WIDTH = bs.constants.CANVAS.CANVAS.scrollWidth;
    bs.constants.CANVAS.SIZE.HEIGHT = bs.constants.CANVAS.CANVAS.scrollHeight;

    bs.constants.LINE = {};
    bs.constants.LINE.COUNT =  11;
    bs.constants.LINE.SIZE = {};
    bs.constants.LINE.SIZE.WIDTH =  (bs.constants.CANVAS.SIZE.WIDTH / bs.constants.LINE.COUNT);
    bs.constants.LINE.SIZE.HEIGHT =  (bs.constants.CANVAS.SIZE.HEIGHT / bs.constants.LINE.COUNT);

    bs.constants.MAP = {};
    bs.constants.MAP.GAP = 1;
    bs.constants.MAP.INDEXES = {};
    bs.constants.MAP.INDEXES.VERTICAL = 'A,B,C,D,E,F,G,H,I,J'.split(',');
    bs.constants.MAP.INDEXES.HORIZONTAL = '1,2,3,4,5,6,7,8,9,10'.split(',');

})();
