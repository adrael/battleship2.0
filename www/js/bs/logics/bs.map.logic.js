(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.logics = (window.bs.logics || {});

    window.bs.logics.Map = Map;

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

        _self = this;
        _self.reset();
    }

    Map.prototype = new bs.Core();
    Map.prototype.constructor = Map;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Map.prototype.absoluteToRelativeCoordinates = function absoluteToRelativeCoordinates(absX, absY) {

        return {
            x: Math.floor(absX / _self.constants.line.size.width),
            y: Math.floor(absY / _self.constants.line.size.height)
        };

    };

    Map.prototype.relativeToAbsoluteCoordinates = function relativeToAbsoluteCoordinates(relX, relY) {

        return {
            x: Math.floor(relX * _self.constants.line.size.width),
            y: Math.floor(relY * _self.constants.line.size.height)
        };

    };

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

    Map.prototype.addShip = function addShip(ship) {

        if (!_self.isShipLocationValid(ship)) {
            throw new bs.exceptions.BSInvalidCoordinatesException(ship.location.x, ship.location.y);
        }

        try {

            _writeMap(ship.location.x, ship.location.y, 1);

            for (var index = 1; index < ship.length; ++index) {

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

                _writeMap(nextLocation.x, nextLocation.y, 1);
                _ships.push(ship);

            }

            ship.isSetOnMap = true;

        } catch (exceptions) {
            bs.utils.handleException(exceptions);
        }

    };

    Map.prototype.isShipLocationValid = function isShipLocationValid(ship) {
        return _locationIsWithinMap(ship) && !_overlappingOtherShips(ship);
    };

    Map.prototype.getFreeCoordinates = function getFreeCoordinates(orientation, length) {

        var _ship = { length: length, orientation: orientation, location: {} };

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
    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _overlappingOtherShips(ship) {

        var cursor = {},
            isHorizontal = (ship.orientation === _self.constants.orientation.horizontal);

        cursor.x = ship.location.x;
        cursor.y = ship.location.y;

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

        var max = _self.constants.line.count,
            vLength = (ship.orientation === _self.constants.orientation.vertical) ? ship.length : 1,
            hLength = (ship.orientation === _self.constants.orientation.horizontal) ? ship.length : 1;

        return ship.location.x >= 0 && ship.location.x + hLength - 1 < max &&
            ship.location.y >= 0 && ship.location.y + vLength - 1 < max;

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

        for (var columns = 1; columns < _self.constants.line.count; ++columns) {
            line.push(0);
        }

        for (var rows = 1; rows < _self.constants.line.count; ++rows) {
            _map.push(bs.utils.merge([], line));
        }

    }



})();
