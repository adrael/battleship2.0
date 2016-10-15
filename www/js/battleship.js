$(document).ready(function () {

    ///////////////////////
    // CONFIGURATION
    ///////////////////////

    window._bs = (window._bs || {});

    if(/*__debugDisabled__*/ false /*__debugDisabled__*/) {

        // CONSOLE OVERRIDE
        var console = {};
        console.log = function () { /* noop */ };
        console.info = function () { /* noop */ };
        console.error = function () { /* noop */ };
        console.debug = function () { /* noop */ };
        window.console = console;

    }

    ///////////////////////
    // ASSETS LOADING
    ///////////////////////

    var itemsLoaded = 0,
        manifest = [
            { 'id': 'LOGO',       'src': 'logo.png' },
            { 'id': 'DESTROYER',  'src': 'ships/destroyer.png' },
            { 'id': 'SUBMARINE',  'src': 'ships/submarine.png' },
            { 'id': 'CRUISER',    'src': 'ships/cruiser.png' },
            { 'id': 'BATTLESHIP', 'src': 'ships/battleship.png' },
            { 'id': 'CARRIER',    'src': 'ships/carrier.png' }
        ];

    window._bs._preload = new createjs.LoadQueue(true);

    // http://www.createjs.com/demos/preloadjs/mediagrid
    // window._bs._preload.on('error', handleError);

    window._bs._preload.on('complete', function () {
        window.console.log('COMPLETED!');
        new bs.core.Game().start();
    });

    window._bs._preload.on('fileload', function (event) {
        window.console.log('LOADED ASSET:', event.item.id);
        window.console.log('PROGRESSION:', Math.floor((++itemsLoaded * 100) / manifest.length) + '%');
    });

    window._bs._preload.loadManifest({
        path: 'img/',
        manifest: manifest
    });

});
