describe('ship', function() {

    var ship = {
        name: 'PETIT BATO',
        length: 1,
        x: 0, y: 0,
        orientation: 'HORIZONTAL'
    };

    describe('horizontal placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation  = 'HORIZONTAL';
            ship.y = 4;
        });

        it('should have x over or equal to zero', function () {
            ship.x = -1;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map length', function () {
            ship.x = 10;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 9;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.x = 6;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });
    });

    describe('vertical placement', function() {

        beforeEach(function () {
            ship.length = 1;
            ship.orientation = 'VERTICAL';
            ship.x = 4;
        });

        it('should have y over or equal to zero', function () {
            ship.y = -1;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 0;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });

        it('should not exceed map height', function () {
            ship.y = 10;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 9;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();

            ship.length = 3;
            expect(bs.map.isShipLocationValid(ship)).toBeFalsy();

            ship.y = 6;
            expect(bs.map.isShipLocationValid(ship)).toBeTruthy();
        });
    });
});
