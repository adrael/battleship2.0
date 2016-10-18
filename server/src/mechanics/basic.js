Mechanic = {

    isDispositionValid: function (map, ships) {
        return Mechanic._mapDimensionsAreValid(map) &&
            Mechanic._hasAllExpectedShips(map, ships) &&
            Mechanic._allShipsAreWithinBoundaries(map, ships) &&
            Mechanic._noShipsAreOverlapping(ships);
    },

    isPlayValid: function (map_boundaries, bombs) {

    },

    processTurn: function (boards, bombs) {

    },

    _mapDimensionsAreValid: function (map) {
        return map.width >= 5 && map.height >= 5;
    },

    _hasAllExpectedShips: function (map, ships) {
        var check = {};
        var types = Object.keys(map.ships);

        for (var t = 0; t < types.length; ++t) {
            check[types[t]] = {
                expected: map.ships[types[t]]
            };
        }
        for (t = 0; t < ships.length; ++t) {
            var type = ships[t].type;
            if (!check[type]) {
                return false;
            }
            if (!check[type].result) {
                check[type].result = 0;
            }
            check[type].result += 1;
        }

        for (var element in check) {
            if (!check.hasOwnProperty(element)) {
                continue;
            }
            if (check[element].expected !== check[element].result) {
                return false;
            }
        }
        return true;
    },

    _allShipsAreWithinBoundaries: function (map, ships) {
        for (var i = 0; i < ships.length; ++i) {
            if (!Mechanic._shipIsWithinBoundaries(map, ships[i])) {
                return false;
            }
        }
        return true;
    },

    _shipIsWithinBoundaries: function (map, ship) {
        return (ship.x >= 0 && (ship.x + ship.width - 1) < map.width) &&
            (ship.y >= 0 && (ship.y + ship.height - 1) < map.height);
    },

    _noShipsAreOverlapping: function (ships) {
        for (var i = 0; i < ships.length; ++i) {
            for (var j = 0; j < ships.length; ++j) {
                if (i === j) {
                    continue;
                }
                if (Mechanic._overlapping(ships[i], ships[j])) {
                    return false;
                }
            }
        }
        return true;
    },

    _overlapping: function (shipA, shipB) {
        return shipA.x + shipA.width > shipB.x &&
            shipA.x < shipB.x + shipB.width &&
            shipA.y + shipA.height > shipB.y &&
            shipA.y < shipB.y + shipB.height;
    }
};

module.exports = Mechanic;
