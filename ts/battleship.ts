/// <reference path="namespaces.ts" />

$(document).ready(() => {

    ///////////////////////
    // ASSETS LOADING
    ///////////////////////

    let itemsLoaded = 0,
        manifest = [
            { 'id': 'MAP',        'src': 'map.png' },
            { 'id': 'LOGO',       'src': 'logo.png' },
            { 'id': 'PLAYER',     'src': 'player.png' },
            { 'id': 'CRUISER',    'src': 'ships/cruiser.png' },
            { 'id': 'CARRIER',    'src': 'ships/carrier.png' },
            { 'id': 'SUBMARINE',  'src': 'ships/submarine.png' },
            { 'id': 'DESTROYER',  'src': 'ships/destroyer.png' },
            { 'id': 'BATTLESHIP', 'src': 'ships/battleship.png' }
        ];

    // http://www.createjs.com/demos/preloadjs/mediagrid
    // bs.data.preload.on('error', handleError);

    bs._data.preload.on('complete', () => {
        // window.console.log('COMPLETED!');
        new bs.core.Game().start();
    });

    // bs.data.preload.on('fileload', function (event) {
    //     window.console.log('LOADED ASSET:', event.item.id);
    //     window.console.log('PROGRESSION:', Math.floor((++itemsLoaded * 100) / manifest.length) + '%');
    // });

    bs._data.preload.loadManifest({
        path: 'img/',
        manifest: manifest
    });

});
