describeLogic('Events (bs.events)', function() {

    var testEventName, testObject;

    beforeEach(function () {
        testEventName = 'BS::TEST';
        testObject = [{a: 'A'}, 23, null];
        bs.events.flush();
    });

    it('can register an event', function () {
        bs.events.on(testEventName, bs.helpers.noop);

        var registeredEventListeners = bs.events.get(testEventName);

        expect(registeredEventListeners.length).not.toBeLessThan(0);
        expect(registeredEventListeners).toEqual([bs.helpers.noop]);
    });

    it('can de-register an event', function () {
        var off = bs.events.on(testEventName, bs.helpers.noop);

        off();
        var registeredEventListeners = bs.events.get(testEventName);

        expect(registeredEventListeners.length).toBe(0);
        expect(registeredEventListeners).toEqual([]);
    });

    it('can broadcast an event', function () {
        bs.events.on(testEventName, function () {
            expect(true).toBeTruthy();
        });

        bs.events.broadcast(testEventName);
    });

    it('can broadcast an event with data', function () {
        bs.events.on(testEventName, function (data) {
            expect(data).toEqual(testObject);
        });

        bs.events.broadcast(testEventName, testObject);
    });

});
