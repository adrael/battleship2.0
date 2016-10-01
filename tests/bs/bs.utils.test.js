describeLogic('Utilities (bs.utils)', function() {

    it('isDate', function () {
        expect(bs.utils.isDate(0)).toBeFalsy();
        expect(bs.utils.isDate(new Date())).toBeTruthy();
    });

    it('isNull', function () {
        expect(bs.utils.isNull(0)).toBeFalsy();
        expect(bs.utils.isNull(null)).toBeTruthy();
    });

    it('isArray', function () {
        expect(bs.utils.isArray({})).toBeFalsy();
        expect(bs.utils.isArray([])).toBeTruthy();
    });

    it('isString', function () {
        expect(bs.utils.isString(0)).toBeFalsy();
        expect(bs.utils.isString('0')).toBeTruthy();
    });

    it('isRegExp', function () {
        expect(bs.utils.isRegExp(0)).toBeFalsy();
        expect(bs.utils.isRegExp(new RegExp(/0/gi))).toBeTruthy();
    });

    it('isObject', function () {
        expect(bs.utils.isObject(null)).toBeFalsy();
        expect(bs.utils.isObject({})).toBeTruthy();
    });

    it('isNumber', function () {
        expect(bs.utils.isNumber('0')).toBeFalsy();
        expect(bs.utils.isNumber(0)).toBeTruthy();
    });

    it('isDefined', function () {
        expect(bs.utils.isDefined(undefined)).toBeFalsy();
        expect(bs.utils.isDefined(0)).toBeTruthy();
    });

    it('isElement', function () {
        expect(bs.utils.isElement(0)).toBeFalsy();
        expect(bs.utils.isElement(document.createElement('p'))).toBeTruthy();
    });

    it('isFunction', function () {
        expect(bs.utils.isFunction(0)).toBeFalsy();
        expect(bs.utils.isFunction(describeLogic)).toBeTruthy();
    });

    it('isUndefined', function () {
        expect(bs.utils.isUndefined(0)).toBeFalsy();
        expect(bs.utils.isUndefined(undefined)).toBeTruthy();
    });

});
