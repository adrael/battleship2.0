(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading map...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    var _map = [],
        _ships = [];

    resetMap();

    bs.map.addShip = addShip;
    bs.map.resetMap = resetMap;
    bs.map.getShipAt = getShipAt;
    bs.map.getFreeCoordinates = getFreeCoordinates;
    bs.map.isShipLocationValid = isShipLocationValid;
    bs.map.relativeToAbsoluteCoordinates = relativeToAbsoluteCoordinates;
    bs.map.absoluteToRelativeCoordinates = absoluteToRelativeCoordinates;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function absoluteToRelativeCoordinates(absX, absY) {

        return {
            x: Math.floor(absX / bs.constants.LINE.SIZE.WIDTH),
            y: Math.floor(absY / bs.constants.LINE.SIZE.HEIGHT)
        };

    }

    function relativeToAbsoluteCoordinates(relX, relY) {

        return {
            x: Math.floor(relX * bs.constants.LINE.SIZE.WIDTH),
            y: Math.floor(relY * bs.constants.LINE.SIZE.HEIGHT)
        };

    }

    function getShipAt(x, y) {

        var result = null;

        bs.helpers.forEach(_ships, function (ship) {

            if (!bs.utils.isNull(result)) return;

            var startX = ship.x,
                endX = (ship.orientation === bs.constants.HORIZONTAL ? ship.x + ship.length - 1 : ship.x),
                startY = ship.y,
                endY = (ship.orientation === bs.constants.HORIZONTAL ? ship.y : ship.y + ship.length - 1);

            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                result = ship;
            }

        });

        return result;

    }

    function addShip(ship) {

        try {

            _writeMap(ship.x, ship.y, 1);

            for (var index = 1; index < ship.length; ++index) {

                var nextLocation = {};

                switch (ship.orientation) {
                    case bs.constants.HORIZONTAL:
                        nextLocation.x = ship.x + index;
                        nextLocation.y = ship.y;
                        break;

                    case bs.constants.VERTICAL:
                        nextLocation.x = ship.x;
                        nextLocation.y = ship.y + index;
                        break;
                }

                _writeMap(nextLocation.x, nextLocation.y, 1);
                _ships.push(ship);

            }

        } catch (exceptions) {
            bs.helpers.handleException(exceptions);
        }

    }

    function isShipLocationValid(ship) {
        return _locationIsWithinMap(ship) && !_overlappingOtherShips(ship);
    }

    function getFreeCoordinates(orientation, length) {

        var _ship = { length: length, orientation: orientation };

        do {

            _ship.x = 1 + Math.abs(Math.floor(Math.random() * (bs.constants.LINE.COUNT - 1)) - length);
            _ship.y = 1 + Math.abs(Math.floor(Math.random() * (bs.constants.LINE.COUNT - 1)) - length);

        } while(!isShipLocationValid(_ship));

        return { x: _ship.x, y: _ship.y };

    }

    function resetMap() {
        _map = [];
        _ships = [];
        _setupMap();
    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function _overlappingOtherShips(ship) {

        var cursor = {},
            isHorizontal = (ship.orientation === bs.constants.HORIZONTAL);

        cursor.x = ship.x;
        cursor.y = ship.y;

        try {

            for (var index = 0; index < ship.length; ++index) {
                _validFreeCoordinates(cursor.x, cursor.y);

                cursor.x += isHorizontal ? 1 : 0;
                cursor.y += !isHorizontal ? 1 : 0;
            }

        } catch (exception) {

            return true;

        }

        return false;
    }

    function _locationIsWithinMap(ship) {

        var gap = bs.constants.MAP.GAP,
            max = bs.constants.LINE.COUNT - gap,
            vLength = (ship.orientation === bs.constants.VERTICAL) ? ship.length : 1,
            hLength = (ship.orientation === bs.constants.HORIZONTAL) ? ship.length : 1;

        return ship.x >= 0 && ship.x + hLength - 1 < max &&
            ship.y >= 0 && ship.y + vLength - 1 < max;

    }

    function _writeMap(x, y, value) {

        var _x = x - 1,
            _y = y - 1;

        if (!bs.utils.isDefined(_map[_y][_x])) {
            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);
        }

        _map[_y][_x] = value;

    }

    function _validFreeCoordinates(x, y) {

        var _x = x - 1,
            _y = y - 1;

        if (!bs.utils.isDefined(_map[_y])) return true;
        if (!bs.utils.isDefined(_map[_y][_x])) return true;

        if (_map[_y][_x] !== 0) {
            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);
        }

    }

    function _setupMap() {

        var line = [];

        for (var columns = 1; columns < bs.constants.LINE.COUNT; ++columns) {
            line.push(0);
        }

        for (var rows = 1; rows < bs.constants.LINE.COUNT; ++rows) {
            _map.push(bs.helpers.merge([], line));
        }

    }

})();
