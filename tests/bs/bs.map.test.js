describeLogic('Map (bs.map)', function() {

    var ship = {
        name: 'PETIT BATO',
        length: 1,
        x: 0, y: 0,
        orientation: 'HORIZONTAL'
    };

    describeLogicPoint('horizontal placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation  = 'HORIZONTAL';
            ship.y = 4;
        });

        it('should have X superior or equal to zero', function () {
            ship.x = -1;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map length', function () {
            ship.x = 11;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.x = 10;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 6;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });
    });

    describeLogicPoint('vertical placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation = 'VERTICAL';
            ship.x = 4;
        });

        it('should have Y superior or equal to zero', function () {
            ship.y = -1;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map height', function () {
            ship.y = 11;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.y = 10;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 6;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });
    });

    describeLogicPoint('placement on map', function () {

        var placedShipA = {};
        var _setShipPosition = function (x, y) {
            ship.x = x;
            ship.y = y;
        };

        beforeEach(function() {
            ship.length = 1;
            ship.orientation = 'HORIZONTAL';
            placedShipA = { name: 'SHIP A', length: 1, x: 4, y: 4, orientation: 'HORIZONTAL' };
            bs.map.resetMap();
        });

        it("should be valid if there is no ship yet on the map", function () {
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });

        it("shouldn't be valid if a 1x1 ship overlaps another 1x1 ship", function () {
            placedShipA.length = 1;
            bs.map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 4x1 ship", function () {
            placedShipA.length = 4;
            placedShipA.orientation = 'HORIZONTAL';
            bs.map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 1, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 2, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x + 3, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("shouldn't be valid if 1x1 ship overlap a 1x4 ship", function () {
            placedShipA.length = 4;
            placedShipA.orientation = 'VERTICAL';
            bs.map.addShip(placedShipA);

            _setShipPosition(placedShipA.x, placedShipA.y);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 1);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 2);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            _setShipPosition(placedShipA.x, placedShipA.y + 3);
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();
        });

        it("should be valid if 1x1 ship doesn't overlap any other ship", function () {
            placedShipA.x = 2;
            placedShipA.y = 2;
            placedShipA.length = 3;
            placedShipA.orientation = 'HORIZONTAL';
            bs.map.addShip(placedShipA);

            _setShipPosition(1, 2);
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(8, 8);
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(2, 1);
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            _setShipPosition(5, 2);
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });
    });
});
