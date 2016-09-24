if(/*__debugDisabled__*/ false /*__debugDisabled__*/) {

    // CONSOLE OVERRIDE
    var console = {};
    console.log = function () { /* noop */ };
    console.info = function () { /* noop */ };
    console.error = function () { /* noop */ };
    console.debug = function () { /* noop */ };
    window.console = console;

}
