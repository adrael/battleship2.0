var expect = require('chai').expect,
    mechanics = require('../../../server/src/mechanics/basic.js');

describe('basic game mechanics', function () {

    var ships = [],
        map = {};

    Ships = {
        carrier: 5,
        battleship: 4,
        cruiser: 3,
        submarine: 3,
        destroyer: 2
    };

    describe('settings', function () {

        var isValid = mechanics.isDispositionValid;
        var makeShip = function (x, y, type, horizontal) {
            return {
                x: x,
                y: y,
                width: horizontal ? Ships[type] : 1,
                height: horizontal ? 1 : Ships[type],
                type: type
            };
        };

        beforeEach(function (done) {
            ships = [];
            map = {
                width: 10,
                height: 10,
                ships: {
                    carrier: 1,
                    battleship: 1,
                    cruiser: 1,
                    submarine: 1,
                    destroyer: 1
                }
            };
            done();
        });

        it('should not be valid if the map has any dimension smaller than 5', function () {
            ships = [makeShip(0, 0, 'carrier', true)];
            map.ships = {carrier: 1};
            map.width = 4;
            map.height = 5;
            expect(isValid(map, ships)).to.be.false;
            map.width = 5;
            map.height = 4;
            expect(isValid(map, ships)).to.be.false;
            map.width = 5;
            map.height = 5;
            expect(isValid(map, ships)).to.be.true;
        });

        it('should not be valid if not all ships have been set', function () {
            ships.push(makeShip(0, 1, 'carrier', true));
            ships.push(makeShip(0, 2, 'battleship', true));
            ships.push(makeShip(0, 3, 'cruiser', true));
            ships.push(makeShip(0, 4, 'submarine', true));
            expect(isValid(map, ships)).to.be.false;
            ships.push(makeShip(0, 5, 'destroyer', true));
            expect(isValid(map, ships)).to.be.true;
            ships.push(makeShip(0, 6, 'destroyer', true));
            expect(isValid(map, ships)).to.be.false;
        });

        it('should not be valid if not all specified ships are present', function () {
            map.ships = {
                destroyer: 2
            };
            ships = [makeShip(0, 0, 'submarine', true), makeShip(0, 1, 'submarine', true)];
            expect(isValid(map, ships)).to.be.false;
            ships = [makeShip(0, 0, 'destroyer', true), makeShip(0, 1, 'submarine', true)];
            expect(isValid(map, ships)).to.be.false;
            ships = [makeShip(0, 0, 'destroyer', true), makeShip(0, 1, 'destroyer', true)];
            expect(isValid(map, ships)).to.be.true;
        });

        it('should not be valid if ships are out of boundaries', function () {
            map.ships = {
                carrier: 1
            };
            ships = [makeShip(-1, 0, 'carrier', true)];
            expect(isValid(map, ships)).to.be.false;
            ships = [makeShip(0, -1, 'carrier', true)];
            expect(isValid(map, ships)).to.be.false;
            ships = [makeShip(9, 0, 'carrier', true)];
            expect(isValid(map, ships)).to.be.false;
            ships = [makeShip(0, 9, 'carrier', false)];
            expect(isValid(map, ships)).to.be.false;
        });

        it('should be valid when all ships are within boundaries', function () {
            map.ships = {
                carrier: 1,
                cruiser: 2
            };
            var carrier = makeShip(9 - 5, 0, 'carrier', true),
                cruiser1 = makeShip(2, 1, 'cruiser', true),
                cruiser2 = makeShip(9 - 3, 1, 'cruiser', true);

            ships = [cruiser1, carrier, cruiser2];
            expect(isValid(map, ships)).to.be.true;
        });

        it('should not be valid if two or more ships are overlapping', function () {
            map.ships = {
                carrier: 2
            };

            ships = [makeShip(0, 0, 'carrier', true), makeShip(0, 0, 'carrier', true)];
            expect(isValid(map, ships)).to.be.false;
            ships[1].x = 5;
            expect(isValid(map, ships)).to.be.true;

            ships[0] = makeShip(0, 3, 'carrier', true);
            ships[1] = makeShip(3, 0, 'carrier', false);
            expect(isValid(map, ships)).to.be.false;

            ships[1].x = 5;
            expect(isValid(map, ships)).to.be.true;
        });
    });
});
