var expect = require('chai').expect,
    mechanics = require('../../../server/src/mechanics/basic.js');

describe('basic game mechanics', function () {

    var ships = [],
        actions = [],
        map = {};

    Ships = {
        carrier: 5,
        battleship: 4,
        cruiser: 3,
        submarine: 3,
        destroyer: 2
    };

    describe('ships settings', function () {

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

            map.ships = {
                battleship: 1,
                destroyer: 1
            };

            ships = [makeShip(1, 1, 'battleship', true), makeShip(2, 1, 'destroyer', true)];
            expect(isValid(map, ships)).to.be.false;

            ships[1] = makeShip(2, 1, 'destroyer', true);
            expect(isValid(map, ships)).to.be.false;

            ships[1] = makeShip(4, 1, 'destroyer', true);
            expect(isValid(map, ships)).to.be.false;

            ships[1] = makeShip(5, 1, 'destroyer', true);
            expect(isValid(map, ships)).to.be.true;
        });
    });

    describe('bombs position', function () {

        var isValid = mechanics.isActionsValid;
        var makeBomb = function (x, y) {
            return {
                type: 'bomb',
                x: x,
                y: y
            };
        };

        beforeEach(function (done) {
            map = {
                width: 10,
                height: 10,
                max: {
                    action: 3,
                    bomb: 3
                }
            };
            actions = [];
            done();
        });

        it('should be valid if the number of actions does not exceed what is authorized', function () {
            map.max.action = 3;
            actions = [];
            expect(isValid(map, actions)).to.be.true;
            actions.push(makeBomb(1, 1));
            expect(isValid(map, actions)).to.be.true;
            actions.push(makeBomb(2, 1));
            expect(isValid(map, actions)).to.be.true;
            actions.push(makeBomb(3, 1));
            expect(isValid(map, actions)).to.be.true;
            actions.push(makeBomb(4, 1));
            expect(isValid(map, actions)).to.be.false;
        });

        it('should be valid if the number of bombs does not exceed what is authorized', function () {
            map.max.actions = 3;
            delete map.max.bomb;
            actions = [makeBomb(1, 1), makeBomb(2, 1), makeBomb(3, 1)];
            expect(isValid(map, actions)).to.be.true;

            map.max.bomb = 2;
            expect(isValid(map, actions)).to.be.false;
            actions.pop();
            expect(isValid(map, actions)).to.be.true;
        });

        it('should be valid if all the bombs are within boundaries', function() {
            actions = [makeBomb(-1, 0)];
            expect(isValid(map, actions)).to.be.false;
            actions = [makeBomb(0, -1)];
            expect(isValid(map, actions)).to.be.false;
            actions = [makeBomb(5, 5)];
            expect(isValid(map, actions)).to.be.true;

            map.width = 5;
            map.height = 5;

            expect(isValid(map, actions)).to.be.false;
            actions = [makeBomb(4, 4)];
            expect(isValid(map, actions)).to.be.true;
        });

        it('should be valid if none of the bombs are overlapping', function() {

            var bombA = makeBomb(1, 1),
                bombB = makeBomb(1, 1),
                bombC = makeBomb(2, 3);

            actions = [bombA, bombB];
            expect(isValid(map, actions)).to.be.false;

            bombA.x = 0;
            expect(isValid(map, actions)).to.be.true;

            actions.push(bombC);
            expect(isValid(map, actions)).to.be.true;

            bombC.x = 0;
            bombC.y = 1;
            expect(isValid(map, actions)).to.be.false;
        })
    });
});
