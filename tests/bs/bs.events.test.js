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

        expect(registeredEventListeners.length).toBe(1);
        expect(registeredEventListeners).toEqual([bs.helpers.noop]);
    });

    it('can de-register an event', function () {
        var off = bs.events.on(testEventName, bs.helpers.noop);
        bs.events.on(testEventName, Array.isArray);
        bs.events.on(testEventName, console.log);

        off();
        var registeredEventListeners = bs.events.get(testEventName);

        expect(registeredEventListeners.length).toBe(2);
        expect(registeredEventListeners).toEqual([Array.isArray, console.log]);
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
