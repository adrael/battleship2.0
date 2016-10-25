describeLogic('bs.map.core', function() {

    var map = new bs.core.Map(),
        orientation = map.constants.get('orientation'),
        ship = {
            UUID: '14',
            name: 'PETIT BATO',
            length: 1,
            location: { x: 1, y: 1 },
            orientation: orientation.horizontal
        };

    describeLogicPoint('horizontal placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation  = orientation.horizontal;
            ship.location.y = 4;
        });

        it('should have X superior or equal to zero', function () {
            ship.location.x = -1;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map length', function () {
            ship.location.x = 11;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.location.x = 10;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.x = 6;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });
    });

    describeLogicPoint('vertical placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation = orientation.vertical;
            ship.location.x = 4;
        });

        it('should have y-axis superior or equal to 1', function () {
            ship.location.y = -1;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map height', function () {
            ship.location.y = 11;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 1;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.location.y = 10;
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            ship.location.y = 6;
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });
    });

    describeLogicPoint('placement on map', function () {

        var placedShipA = {};
        var _setShipPosition = function (x, y) {
            ship.location.x = x;
            ship.location.y = y;
        };

        beforeEach(function() {
            ship.length = 1;
            ship.orientation = orientation.horizontal;
            placedShipA = {
                UUID: '100',
                name: 'SHIP A',
                length: 1,
                location: { x: 4, y: 4 },
                orientation: orientation.horizontal
            };
            map.reset();
        });

        it("should be valid if there is no ship yet on the map", function () {
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });

        it("shouldn't be valid if a 1x1 ship overlaps another 1x1 ship", function () {
            placedShipA.length = 1;
            map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 4x1 ship", function () {
            placedShipA.length = 4;
            placedShipA.orientation = orientation.horizontal;
            map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 1, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 2, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 3, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 1x4 ship", function () {
            placedShipA.length = 4;
            placedShipA.orientation = orientation.vertical;
            map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 1);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 2);
            expect(map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 3);
            expect(map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("should be valid if 1x1 ship doesn't overlap any other ship", function () {
            placedShipA.location.x = 2;
            placedShipA.location.y = 2;
            placedShipA.length = 3;
            placedShipA.orientation = orientation.horizontal;
            map.addShip(placedShipA);

            _setShipPosition(1, 2);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(8, 8);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(2, 1);
            expect(map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(5, 2);
            expect(map.isShipLocationValid(ship)).toBeTruthy();
        });
    });
});
