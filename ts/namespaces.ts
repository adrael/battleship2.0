/// <reference path="../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../node_modules/@types/createjs/index.d.ts" />

namespace bs {

    export namespace core {}
    export namespace ships {}
    export namespace utils {}
    export namespace events {}
    export namespace exceptions {}

    export namespace _ {
        export let stage: createjs.Stage = null;
        export let ticker: bs.core.Ticker = null;
        export let preload: createjs.LoadQueue = new createjs.LoadQueue(true);
        export let constants: bs.core.Constants = null;
        export let debugEnabled: boolean = (() => { return true /*__debugEnabled__*/; })();
    }

}
