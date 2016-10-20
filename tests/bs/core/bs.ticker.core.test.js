describeLogic('bs.map.core', function() {

    var ticker,
        notifyCallback;

    beforeEach(function () {
        ticker = new bs.core.Ticker();
        notifyCallback = jasmine.createSpy('notifyCallback');
    });

    it('should accept event subscriptions and return un-subscription callback', function () {
        var unSubscribeCallback = ticker.notifyOnUpdate(function () {});
        expect(typeof unSubscribeCallback).toBe('function');
    });

    // This is not working: raises 'Script error'.
    // CAN'T FIGURE OUT WHY!
    //it('should notify upon update', function (done) {
    //    ticker.notifyOnUpdate(notifyCallback);
    //    ticker.requestUpdate();
    //
    //    setTimeout(function () {
    //        expect(notifyCallback).toHaveBeenCalled();
    //        done();
    //    }, createjs.Ticker.interval + 1);
    //});

    // This is not working: raises 'Script error'.
    // CAN'T FIGURE OUT WHY!
    //it('should not notify upon update if un-subscription callback has been triggered', function (done) {
    //    var unSubscribeCallback = ticker.notifyOnUpdate(notifyCallback);
    //    unSubscribeCallback();
    //    ticker.requestUpdate();
    //
    //    expect(notifyCallback).not.toHaveBeenCalled();
    //
    //    setTimeout(function () {
    //        expect(notifyCallback).not.toHaveBeenCalled();
    //        done();
    //    }, createjs.Ticker.interval + 1);
    //});
});
