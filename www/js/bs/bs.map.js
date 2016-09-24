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

    _setupMap();

    bs.map.addShip = addShip;
    bs.map.getShipAt = getShipAt;
    bs.map.isShipLocationValid = isShipLocationValid;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function getShipAt(x, y) {

        var result = null;

        bs.helpers.forEach(_ships, function (ship) {

            if (!bs.utils.isNull(result)) return;

            var startX = ship.x,
                endX = (ship.orientation === 'HORIZONTAL' ? ship.x + ship.length - 1 : ship.x),
                startY = ship.y,
                endY = (ship.orientation === 'HORIZONTAL' ? ship.y : ship.y + ship.length - 1);

            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                result = ship;
            }

        });

        return result;

    }

    function addShip(ship) {

        console.warn('Adding', ship.name, 'to map at (' + ship.x + ', ' + ship.y + ')');

        try {

            _writeMap(ship.x, ship.y, 1);

            for (var index = 1; index < ship.length; ++index) {

                var nextLocation = {};

                switch (ship.orientation) {
                    case 'HORIZONTAL':
                        nextLocation.x = ship.x + index;
                        nextLocation.y = ship.y;
                        break;

                    case 'VERTICAL':
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
        switch (ship.orientation) {
            case 'HORIZONTAL':
                return _computeHorizontalConstraints(ship);
            case 'VERTICAL':
                return _computeVerticalConstraints(ship);
        }
    }

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function _computeHorizontalConstraints(ship) {

        //console.log('>> _computeHorizontalConstraints for', ship.name, 'at (' + ship.x + ', ' + ship.y + ')');

        var gap = bs.constants.MAP.GAP;

        if (!_withinMap(ship)) {
            return false;
        }

        for (var index = 0; index < ship.length; ++index) {

            var isHead = (index === 0),
                isTail = (index === ship.length - 1);

            try {

                if (isHead) {

                    //console.log(' >> HEAD');
                    _validFreeCoordinates(ship.x,       ship.y - gap);
                    _validFreeCoordinates(ship.x - gap, ship.y - gap);
                    _validFreeCoordinates(ship.x - gap, ship.y);
                    _validFreeCoordinates(ship.x - gap, ship.y + gap);
                    _validFreeCoordinates(ship.x,       ship.y + gap);

                } else if (isTail) {

                    //console.log(' >> TAIL');
                    _validFreeCoordinates(ship.x,               ship.y - gap + index);
                    _validFreeCoordinates(ship.x + gap + index, ship.y - gap + index);
                    _validFreeCoordinates(ship.x + gap + index, ship.y);
                    _validFreeCoordinates(ship.x + gap + index, ship.y + gap + index);
                    _validFreeCoordinates(ship.x,               ship.y + gap + index);

                } else {

                    //console.log(' >> MIDDLE');
                    _validFreeCoordinates(ship.x + index, ship.y - gap);
                    _validFreeCoordinates(ship.x + index, ship.y + gap);

                }

            } catch (exception) {

                //bs.helpers.handleException(exception);
                return false;

            }

        }

        return true;

    }

    function _computeVerticalConstraints(ship) {

        //console.log('>> _computeVerticalConstraints for', ship.name, 'at (' + ship.x + ', ' + ship.y + ')');

        var gap = bs.constants.MAP.GAP;

        if (!_withinMap(ship)) {
            return false;
        }

        for (var index = 0; index < ship.length; ++index) {

            var isHead = (index === 0),
                isTail = (index === ship.length - 1);

            try {

                if (isHead) {

                    //console.log(' >> HEAD');
                    _validFreeCoordinates(ship.x + gap, ship.y);
                    _validFreeCoordinates(ship.x + gap, ship.y - gap);
                    _validFreeCoordinates(ship.x,       ship.y - gap);
                    _validFreeCoordinates(ship.x - gap, ship.y - gap);
                    _validFreeCoordinates(ship.x - gap, ship.y);

                } else if (isTail) {

                    //console.log(' >> TAIL');
                    _validFreeCoordinates(ship.x + gap + index, ship.y);
                    _validFreeCoordinates(ship.x + gap + index, ship.y + gap + index);
                    _validFreeCoordinates(ship.x,               ship.y + gap + index);
                    _validFreeCoordinates(ship.x - gap + index, ship.y + gap + index);
                    _validFreeCoordinates(ship.x - gap + index, ship.y);

                } else {

                    //console.log(' >> MIDDLE');
                    _validFreeCoordinates(ship.x + gap, ship.y + index);
                    _validFreeCoordinates(ship.x - gap, ship.y + index);

                }

            } catch (exception) {

                //bs.helpers.handleException(exception);
                return false;

            }

        }

        return true;

    }

    function _withinMap(ship) {
        var gap = bs.constants.MAP.GAP,
            max = bs.constants.LINE.COUNT - gap;
        if (ship.orientation === 'HORIZONTAL') {
            return (ship.x >= 0 && ship.x + ship.length - 1 < max && ship.y >= 0 && ship.y < max);
        } else {
            return (ship.x >= 0 && ship.x < max && ship.y >= 0 && ship.y + ship.length - 1 < max);
        }
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

        //console.log('  >> _validFreeCoordinates', x, y);

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
