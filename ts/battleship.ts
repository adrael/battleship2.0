/// <reference path="namespaces.ts" />

$(document).ready(() => {

    ///////////////////////
    // CONFIGURATION
    ///////////////////////

    if(!bs._.debugEnabled) {

        // CONSOLE OVERRIDE
        window.console = <any>{
            log: () => {},
            info: () => {},
            error: () => {},
            debug: () => {}
        };

    }

    ///////////////////////
    // ASSETS LOADING
    ///////////////////////

    let itemsLoaded = 0,
        manifest = [
            { 'id': 'LOGO',       'src': 'logo.png' },
            { 'id': 'DESTROYER',  'src': 'ships/destroyer.png' },
            { 'id': 'SUBMARINE',  'src': 'ships/submarine.png' },
            { 'id': 'CRUISER',    'src': 'ships/cruiser.png' },
            { 'id': 'BATTLESHIP', 'src': 'ships/battleship.png' },
            { 'id': 'CARRIER',    'src': 'ships/carrier.png' }
        ];

    // http://www.createjs.com/demos/preloadjs/mediagrid
    // bs.data.preload.on('error', handleError);

    bs._.preload.on('complete', () => {
        // window.console.log('COMPLETED!');
        new bs.core.Game().start();
    });

    // bs.data.preload.on('fileload', function (event) {
    //     window.console.log('LOADED ASSET:', event.item.id);
    //     window.console.log('PROGRESSION:', Math.floor((++itemsLoaded * 100) / manifest.length) + '%');
    // });

    bs._.preload.loadManifest({
        path: 'img/',
        manifest: manifest
    });

});
