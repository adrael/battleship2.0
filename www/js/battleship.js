$(document).ready(function () {

    ///////////////////////
    // CONFIGURATION
    ///////////////////////

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

    window.console.error('TODO: Replace assets loading by PreloadJS');
    // -- Replace with PreloadJS
    // -- Resources to be loaded here:
    // - img/logo.png
    // - img/ships/*.png

    var ship = new createjs.Bitmap('img/ships/submarine.png');

    ship.image.onload = function () {
        window._SUBMARINE = ship.image;
        new bs.Game().start();
    };

    ///////////////////////
    // GAME
    ///////////////////////

    //new bs.Game().start();

});
