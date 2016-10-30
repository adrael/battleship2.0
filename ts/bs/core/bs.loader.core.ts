/// <reference path="../../bs.ts" />

namespace bs {

    export namespace core {

        let _loader: createjs.LoadQueue = null;
        let _instance: bs.core.Loader = null;
        let _manifest: Array<{id: string, src: string}> = [
            { id: 'MAP',        src: 'map.png' },
            { id: 'LOGO',       src: 'logo.png' },
            { id: 'MARK',       src: 'mark.png' },
            { id: 'TARGET',     src: 'target.png' },
            { id: 'PLAYER',     src: 'player.png' },
            { id: 'CRUISER',    src: 'ships/cruiser.png' },
            { id: 'CARRIER',    src: 'ships/carrier.png' },
            { id: 'SUBMARINE',  src: 'ships/submarine.png' },
            { id: 'DESTROYER',  src: 'ships/destroyer.png' },
            { id: 'BATTLESHIP', src: 'ships/battleship.png' }
        ];

        export class Loader extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/



            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();

                if (bs.utils.isNull(_instance)) {
                    _instance = this;
                    _loader = new createjs.LoadQueue(true);
                }

                return _instance;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public get = (name: string) : any => {
                return _loader.getResult(name);
            };

            public loadAssets = (successHandler?: Function, errorHandler?: Function) : bs.core.Loader => {
                let itemsLoaded = 0;

                // http://www.createjs.com/demos/preloadjs/mediagrid
                // bs.data.preload.on('error', handleError);

                _loader.on('complete', () => {
                    if (bs.utils.isFunction(successHandler)) {
                        successHandler();
                    }
                });

                // _loader.on('fileload', (event: any) => {
                //     window.console.log('LOADED ASSET:', event.item.id);
                //     window.console.log('PROGRESSION:', Math.floor((++itemsLoaded * 100) / _manifest.length) + '%');
                // });

                _loader.loadManifest({
                    path: 'img/',
                    manifest: _manifest
                });

                return _instance;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

    }

}
