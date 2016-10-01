(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading display...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.display.drawShip = drawShip;
    bs.display.drawBoard = drawBoard;
    bs.display.setInterface = setInterface;
    bs.display.drawRandomShips = drawRandomShips;

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

            console.log('Click registered at:', coordinates.x, coordinates.y);
            console.log(bs.map.getShipAt(coordinates.x, coordinates.y));
        };

    }

    function drawRandomShips() {

        bs.helpers.forEach(bs.ships, function (ship) {

            try {

                ship.orientation = ((Math.random() * 100) > 50 ? bs.constants.HORIZONTAL : bs.constants.VERTICAL);

                var freeCoordinates = bs.map.getFreeCoordinates(ship.orientation, ship.length);
                ship.x = freeCoordinates.x;
                ship.y = freeCoordinates.y;

                drawShip(ship);

            }
            catch (exception) {
                console.error('Cannot place ship:', ship);
            }

        });

    }

    function drawBoard() {

        _drawLines();
        _drawIndexes();

    }

    function drawShip(ship) {

        if (!bs.map.isShipLocationValid(ship)) {
            throw new bs.exceptions.BSInvalidCoordinatesException(ship.x, ship.y);
        }

        bs.map.addShip(ship);

        var shipPosition = {
                x: ship.x * bs.constants.LINE.SIZE.WIDTH,
                y: ship.y * bs.constants.LINE.SIZE.HEIGHT,
                w: (ship.orientation === bs.constants.HORIZONTAL ? ship.length : 1) * bs.constants.LINE.SIZE.WIDTH,
                h: (ship.orientation === bs.constants.VERTICAL   ? ship.length : 1) * bs.constants.LINE.SIZE.HEIGHT
            },
            shipSpriteData = ship.sprite[ship.orientation],
            aspectRatio = bs.helpers.getAspectRatioFit(shipSpriteData.width, shipSpriteData.height, shipPosition.w, shipPosition.h);

        if(/*__debugEnabled__*/ true /*__debugEnabled__*/) {
            //bs.canvas.fillRect(shipPosition, bs.constants.COLORS.WHITE);
            bs.canvas.drawRect(shipPosition);
        }

        bs.canvas.drawImageFromSprite(
            bs.constants.SPRITES[ship.orientation],
            shipSpriteData.x,
            shipSpriteData.y,
            shipSpriteData.width,
            shipSpriteData.height,
            shipPosition.x + ((shipPosition.w - aspectRatio.width) / 2),
            shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2),
            aspectRatio.width,
            aspectRatio.height
        );

    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function _drawLines() {

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

    function _drawIndexes() {

        var verticalIndexes = bs.constants.MAP.INDEXES.VERTICAL,
            horizontalIndexes = bs.constants.MAP.INDEXES.HORIZONTAL,
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
                bs.canvas.fillRect({ x: 0, y: currentHorizontalPosition, w: squareWidth, h: squareHeight}, bs.constants.COLORS.WHITE);
                bs.canvas.drawImage('img/battleship.png', 5, 5, squareWidth - 10, squareHeight - 10);
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

})();
