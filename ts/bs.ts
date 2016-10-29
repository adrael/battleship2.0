/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/createjs/index.d.ts" />

$(document).ready(() => {

    let loader = new bs.core.Loader();

    loader.loadAssets(
        new bs.core.Game().setup,
        () => { console.error('Error while loading assets...'); }
    );

});
