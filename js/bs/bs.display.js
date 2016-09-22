(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading display...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.display.drawGrid = drawGrid;
    bs.display.drawIndexes = drawIndexes;
    bs.display.drawRandomShips = drawRandomShips;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function drawRandomShips() {

        var ships = [
            { name: 'TORPEDO', length: 2 },
            { name: 'SUBMARINE', length: 3 },
            { name: 'DESTROYER', length: 3 },
            { name: 'CRUISER', length: 4 },
            { name: 'AIRCRAFT CARRIER', length: 5 }
        ];

        bs.helpers.forEach(ships, _placeShip);

    }

    function drawIndexes() {

        var verticalIndexes = 'A,B,C,D,E,F,G,H,I,J'.split(','),
            horizontalIndexes = '1,2,3,4,5,6,7,8,9,10'.split(','),
            context = bs.constants.CANVAS.CONTEXT,
            squareHeight = bs.constants.LINE.SIZE.HEIGHT,
            squareWidth = bs.constants.LINE.SIZE.WIDTH;

        context.font = '16pt Arial';
        context.textBaseline = 'middle';

        for (var index = 0; index < bs.constants.LINE.COUNT; ++index) {

            var currentVerticalPosition = (index * bs.constants.LINE.SIZE.WIDTH);
            bs.canvas.fillRect({ x: currentVerticalPosition, y: 0, w: squareWidth, h: squareHeight });

            var currentHorizontalPosition = (index * bs.constants.LINE.SIZE.HEIGHT);
            bs.canvas.fillRect({ x: 0, y: currentHorizontalPosition, w: squareWidth, h: squareHeight });

            if (index <= 0) {
                var img = new Image();
                img.onload = function() {
                    context.drawImage(img, 5, 5, squareWidth-10, squareHeight-10);
                };
                img.src = 'img/battleship.png';
                continue;
            }

            var verticalText = verticalIndexes[index - 1];
            bs.canvas.drawText(
                verticalText,
                {
                    x: currentVerticalPosition + squareWidth / 2 - context.measureText(verticalText).width / 2,
                    y: squareHeight / 2
                }
            );

            var horizontalText = horizontalIndexes[index - 1];
            bs.canvas.drawText(
                horizontalText,
                {
                    x: squareWidth / 2 - context.measureText(horizontalText).width / 2,
                    y: currentHorizontalPosition + squareHeight / 2
                }
            );

        }

    }

    function drawGrid() {

        for (var line = 1; line < bs.constants.LINE.COUNT; ++line) {

            var currentVerticalPosition = (line * bs.constants.LINE.SIZE.WIDTH);
            bs.canvas.drawLine(
                { x: currentVerticalPosition, y: 0 },
                { x: currentVerticalPosition, y: bs.constants.CANVAS.SIZE.WIDTH },
                .2
            );

            var currentHorizontalPosition = (line * bs.constants.LINE.SIZE.HEIGHT);
            bs.canvas.drawLine(
                { x: 0, y: currentHorizontalPosition },
                { x: bs.constants.CANVAS.SIZE.HEIGHT, y: currentHorizontalPosition },
                .2
            );

        }

    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function _placeShip(ship) {

        var orientation = ((Math.random() * 100) > 50 ? 'HORIZONTAL' : 'VERTICAL'),
            shipPosition = {
                x: bs.constants.LINE.SIZE.WIDTH + (Math.abs(Math.floor(Math.random() * 10) - ship.length) * bs.constants.LINE.SIZE.WIDTH),
                y: bs.constants.LINE.SIZE.HEIGHT + (Math.abs(Math.floor(Math.random() * 10) - ship.length) * bs.constants.LINE.SIZE.HEIGHT),
                w: (orientation === 'HORIZONTAL' ? ship.length : 1) * bs.constants.LINE.SIZE.WIDTH,
                h: (orientation === 'VERTICAL' ? ship.length : 1) * bs.constants.LINE.SIZE.HEIGHT
            };

        // calcul des contraintes avant dessin ici sinon recursivité

        bs.canvas.fillRect(shipPosition, bs.constants.COLORS.RED);
        bs.canvas.drawRect(shipPosition);

    }

})();