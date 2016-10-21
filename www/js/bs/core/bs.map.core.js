(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Map = Map;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _map = [],
        _ships = [],
        _self = null;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Map() {

        bs.core.Core.call(this);

        _self = this;
        _self.reset();
    }

    Map.prototype = bs.core.Core.prototype;
    Map.prototype.constructor = Map;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Map.prototype.getShipAt = function getShipAt(x, y) {

        var result = null;

        bs.utils.forEach(_ships, function (ship) {

            if (!bs.utils.isNull(result)) return;

            var startX = ship.location.x,
                endX = (ship.orientation === _self.constants.orientation.horizontal ? ship.location.x + ship.length - 1 : ship.location.x),
                startY = ship.location.y,
                endY = (ship.orientation === _self.constants.orientation.horizontal ? ship.location.y : ship.location.y + ship.length - 1);

            if (x >= startX && x <= endX && y >= startY && y <= endY) {
                result = ship;
            }

        });

        return result;

    };

    Map.prototype.moveShip = function moveShip(oldShip, newShip) {
        try {
            _clearShipOnMap(oldShip);
            _addShipOnMap(newShip);
            return this;
        } catch (exceptions) {
            bs.utils.handleException(exceptions);
        }
    };

    Map.prototype.addShip = function addShip(ship) {
        if (!_self.isShipLocationValid(ship)) {
            throw new bs.exceptions.BSInvalidCoordinatesException(ship.location.x, ship.location.y);
        }

        try {
            _addShipOnMap(ship);
            return this;
        } catch (exceptions) { bs.utils.handleException(exceptions); }
    };

    Map.prototype.isShipLocationValid = function isShipLocationValid(ship) {
        return _self.locationIsWithinMap(ship) && !_overlappingOtherShips(ship);
    };

    Map.prototype.getFreeCoordinates = function getFreeCoordinates(orientation, length) {

        var _ship = {
            name: 'FAKE',
            length: length,
            orientation: orientation,
            location: {}
        };

        do {

            _ship.location.x = 1 + Math.abs(Math.floor(Math.random() * (_self.constants.line.count)) - length);
            _ship.location.y = 1 + Math.abs(Math.floor(Math.random() * (_self.constants.line.count)) - length);

        } while(!_self.isShipLocationValid(_ship));

        return { x: _ship.location.x, y: _ship.location.y };

    };

    Map.prototype.reset = function reset() {
        _map = [];
        _ships = [];
        _setupMap();
        return this;
    };

    Map.prototype.print = function print() {

        console.log('      [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]');
        console.log('     -----------------------------------------');

        bs.utils.forEach(_map, function (indexes, row) {
            var _row = row + 1,
                line = (_row <= 9 ? ' ' : '') + '[' + _row + '] | ';

            bs.utils.forEach(indexes, function (index) {
                line += index.length + ' | ';
            });

            console.log(line);
            if (row < _map.length - 1) {
                console.log('     |---|---|---|---|---|---|---|---|---|---|');
            } else {
                console.log('     -----------------------------------------');
            }
        });
        return this;

    };

    Map.prototype.locationIsWithinMap = function locationIsWithinMap(ship) {

        var max = _self.constants.line.count,
            vLength = (ship.orientation === _self.constants.orientation.vertical) ? ship.length : 1,
            hLength = (ship.orientation === _self.constants.orientation.horizontal) ? ship.length : 1;

        return ship.location.x >= 1 && ship.location.x + hLength - 1 < max &&
            ship.location.y >= 1 && ship.location.y + vLength - 1 < max;

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _overlappingOtherShips(ship) {

        var cursor = {},
            isHorizontal = (ship.orientation === _self.constants.orientation.horizontal);

        try {

            for (var index = 0; index < ship.length; ++index) {
                cursor.x = ship.location.x + (isHorizontal ? index : 0);
                cursor.y = ship.location.y + (isHorizontal ? 0 : index);
                _validFreeCoordinates(cursor.x, cursor.y, ship);
            }

        } catch (exception) {
            return true;
        }

        return false;
    }

    function _validFreeCoordinates(x, y, ship) {

        var _x = x - 1,
            _y = y - 1;

        if (bs.utils.isUndefined(_map[_y]) || bs.utils.isUndefined(_map[_y][_x])) {
            throw new bs.exceptions.BSInvalidCoordinatesException(x, y)
        }

        if (_map[_y][_x].length === 0) {
            return true;
        }
        else {

            var __map = bs.utils.merge([], _map[_y][_x]),
                shipIndex = __map.indexOf(ship.name);

            if (shipIndex !== -1) {
                __map.splice(shipIndex, 1);
            }

            if (__map.length === 0) {
                return true;
            }

            if(/*__debugEnabled__*/ true /*__debugEnabled__*/) {
                //console.error('('+x+', '+y+') has:', __map, 'and trying to add', ship.name);
            }

            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);
        }

    }

    function _setupMap() {
        var line = [];

        for (var columns = 0; columns < _self.constants.line.count - 1; ++columns) {
            line.push([]);
        }

        for (var rows = 0; rows < _self.constants.line.count - 1; ++rows) {
            _map.push(bs.utils.merge([], line));
        }
    }

    function _clearShipOnMap(ship) {
        _shipWriter(ship, ship.name, true);
    }

    function _addShipOnMap(ship) {
        _shipWriter(ship, ship.name);
        _ships.push(ship);
    }

    function _shipWriter(ship, value, erase) {

        for (var index = 0; index < ship.length; ++index) {

            var nextLocation = {};

            switch (ship.orientation) {
                case _self.constants.orientation.horizontal:
                    nextLocation.x = ship.location.x + index;
                    nextLocation.y = ship.location.y;
                    break;

                case _self.constants.orientation.vertical:
                    nextLocation.x = ship.location.x;
                    nextLocation.y = ship.location.y + index;
                    break;
            }

            _writeMap(nextLocation.x, nextLocation.y, value, erase);

        }

    }

    function _writeMap(x, y, value, erase) {

        var _x = x - 1,
            _y = y - 1;

        if (bs.utils.isUndefined(_map[_y]) || bs.utils.isUndefined(_map[_y][_x])) {
            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);
        }

        if (erase) {
            _map[_y][_x].splice(_map[_y][_x].indexOf(value), 1);
        } else {
            _map[_y][_x].push(value);
        }

    }

})();
