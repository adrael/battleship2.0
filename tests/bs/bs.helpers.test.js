describeLogic('Helpers (bs.helpers)', function() {

    var objA, objB, objC, arrA, arrB, itemsA, itemsB;

    beforeEach(function () {
        objA = { a: 'A' };
        objB = { b: 'B' };
        objC = { c: 'C', d: objA };
        arrA = [ objA ];
        arrB = [ objB ];
        itemsA = { a: 'A', b: 'B', c: 'C' };
        itemsB = [ 0, 'a', new Date().toJSON(), null ];
    });

    it('merge', function () {
        expect(bs.helpers.merge({}, objA, objB)).toEqual({a: 'A', b: 'B'});
        expect(bs.helpers.merge({}, objC)).toEqual({c: 'C', d: {a: 'A'}});
        expect(bs.helpers.merge([], arrA, arrB)).toEqual([{a: 'A', b: 'B'}]);
    });

    it('extend', function () {
        expect(bs.helpers.extend({}, objA, objB)).toEqual({a: 'A', b: 'B'});
        expect(bs.helpers.extend({}, objC)).toEqual({c: 'C', d: {a: 'A'}});
        expect(bs.helpers.extend([], arrA, arrB)).toEqual([{b: 'B'}]);
    });

    it('forEach', function () {
        bs.helpers.forEach(itemsA, function (item, index) {
            expect(itemsA.hasOwnProperty(index)).toBeTruthy();
            expect(item).toEqual(itemsA[index]);
        });

        bs.helpers.forEach(itemsB, function (item, index) {
            expect(index).not.toBeLessThan(0);
            expect(index).toBeLessThan(itemsB.length);
            expect(item).toEqual(itemsB[index]);
        });
    });

    it('validObject', function () {
        bs.helpers.validObject(objA, ['a']);
        expect(true).toBeTruthy();

        try { bs.helpers.validObject(objA, ['b']); }
        catch (exception) { expect(false).toBeFalsy(); }
    });

});
