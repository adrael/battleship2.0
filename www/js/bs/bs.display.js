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

            console.log(bs.map.getShipAt(coordinates.x, coordinates.y));
        };

    }

    function drawRandomShips() {

        var ships = [
            { name: 'TORPEDO',          length: 2, x: 4, y: 2,  orientation: 'HORIZONTAL' },
            { name: 'SUBMARINE',        length: 3, x: 3, y: 4,  orientation: 'VERTICAL' },
            { name: 'DESTROYER',        length: 3, x: 6, y: 6,  orientation: 'HORIZONTAL' },
            { name: 'CRUISER',          length: 4, x: 9, y: 1,  orientation: 'VERTICAL' },
            { name: 'AIRCRAFT CARRIER', length: 5, x: 2, y: 9,  orientation: 'HORIZONTAL' }
        ];

        bs.helpers.forEach(ships, _placeShip);

    }

    function drawIndexes() {

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

        //var orientation = ((Math.random() * 100) > 50 ? 'HORIZONTAL' : 'VERTICAL'),
        //
        //    shipRelativePosition = {
        //        x: 1 + Math.abs(Math.floor(Math.random() * 10) - ship.length),
        //        y: 1 + Math.abs(Math.floor(Math.random() * 10) - ship.length),
        //        w: (orientation === 'HORIZONTAL' ? ship.length : 1),
        //        h: (orientation === 'VERTICAL' ? ship.length : 1)
        //    },
        //
        //    shipAbsolutePosition = {
        //        x: shipRelativePosition.x * bs.constants.LINE.SIZE.WIDTH,
        //        y: shipRelativePosition.y * bs.constants.LINE.SIZE.HEIGHT,
        //        w: shipRelativePosition.w * bs.constants.LINE.SIZE.WIDTH,
        //        h: shipRelativePosition.h * bs.constants.LINE.SIZE.HEIGHT
        //    },
        //
        //    extendedShip = bs.helpers.merge({}, ship, shipRelativePosition, { orientation: orientation });
        //
        //if (!bs.map.isShipLocationValid(extendedShip)) {
        //
        //    console.error('Cannot place ship:', extendedShip);
        //    return _placeShip(ship);
        //}
        //
        //bs.map.addShip(extendedShip);
        //
        //bs.canvas.fillRect(shipAbsolutePosition, bs.constants.COLORS.RED);
        //bs.canvas.drawRect(shipAbsolutePosition);

        var shipAbsolutePosition = {
            x: ship.x * bs.constants.LINE.SIZE.WIDTH,
            y: ship.y * bs.constants.LINE.SIZE.HEIGHT,
            w: (ship.orientation === 'HORIZONTAL' ? ship.length : 1) * bs.constants.LINE.SIZE.WIDTH,
            h: (ship.orientation === 'VERTICAL'   ? ship.length : 1) * bs.constants.LINE.SIZE.HEIGHT
        };

        if (!bs.map.isShipLocationValid(ship)) {
            console.error('Cannot place ship:', ship);
            throw new bs.exceptions.BSInvalidCoordinatesException(ship.x, ship.y);
        }

        bs.map.addShip(ship);

        bs.canvas.fillRect(shipAbsolutePosition, bs.constants.COLORS.RED);
        bs.canvas.drawRect(shipAbsolutePosition);

    }

})();
