/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace ships {

        let _enum: any = null;
        let _frozen: boolean = false;
        let _redFilter:   createjs.ColorFilter = new createjs.ColorFilter(0,0,0,1, 238,64,0,0);
        let _greenFilter: createjs.ColorFilter = new createjs.ColorFilter(0,0,0,1, 0,139,69,0);
        let _blackFilter: createjs.ColorFilter = new createjs.ColorFilter(0,0,0,1, 54,57,59,0);

        export abstract class AbstractShip extends bs.core.Core {

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/

            private _debugArea: createjs.Shape = new createjs.Shape();
            private _beingDragged: boolean = false;
            private _updateListener: Function = null;
            private _invalidLocation: boolean = false;
            private _invalidLocationIndicator: createjs.Shape = new createjs.Shape();

            public map: bs.core.Map = null;
            public name: string = 'ABSTRACT_SHIP';
            public scale: number = 0;
            public length: number = 0;
            public template: createjs.Bitmap = null;
            public location: any = { x: 1, y: 1 };
            public orientation: string = this.constants.get('orientation').horizontal;

            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor(name: string = 'ABSTRACT_SHIP', length: number = 0, map: bs.core.Map = new bs.core.Map()) {
                super();

                _enum = this.constants.get('enum');

                this.length = length;

                if ((Math.random() * 100) > 50) {
                    this.orientation = this.constants.get('orientation').vertical;
                }

                this.setMap(map);
                this.setName(name);
                this.setTemplate(new createjs.Bitmap(bs._data.preload.getResult(name)));
                this.init();
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public setTemplate = (template: createjs.Bitmap = null) : this => {
                this.template = template;
                this.template.name = this.name;
                this.template.cursor = 'pointer';
                this.template.filters = [ _blackFilter ];

                let self = this;
                this.template.on('click',     function (event) { _shipClicked.call(this, event, self); });
                this.template.on('pressup',   function (event) { _shipUnselected.call(this, event, self); });
                this.template.on('rollout',   function (event) { _shipUnhovered.call(this, event, self); });
                this.template.on('rollover',  function (event) { _shipHovered.call(this, event, self); });
                this.template.on('pressmove', function (event) { _shipMoved.call(this, event, self); });
                this.template.on('mousedown', function (event) { _shipSelected.call(this, event, self); });
                _templateCache(this.template);

                return this;
            };

            public setName = (name: string) : this => {
                if (bs.utils.isString(name) && name.length) {
                    this.name = name;
                    if (this.template) {
                        this.template.name = name;
                    }
                }
                return this;
            };

            public setMap = (map: bs.core.Map) : this => {
                if (!this.isValidMap(map)) {
                    this.map = null
                } else { this.map = map; }
                return this;
            };

            public hasValidMap = () : boolean => {
                return this.isValidMap(this.map);
            };

            public isValidMap = (map: bs.core.Map) : boolean => {
                return map instanceof bs.core.Map;
            };

            public doLocationCheck = () : this => {
                this.clearLocationCheck();

                if (this.hasValidMap() && !this.map.isShipLocationValid(this)) {

                    let shipPosition = this.getPosition();

                    this._invalidLocationIndicator
                        .graphics
                        .setStrokeStyle(1)
                        .beginFill(this.constants.get('colors').red)
                        .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                        .endFill();

                    this._invalidLocationIndicator.alpha = .3;

                    if (!this._invalidLocationIndicator.parent) {
                        this.stage.addChild(this._invalidLocationIndicator);
                    }

                    this.red();
                    this._invalidLocation = true;
                    this.ticker.requestUpdate();

                }

                return this;
            };

            public clearLocationCheck = () : this => {
                if (this._invalidLocation) {
                    this.black();
                    this._invalidLocation = false;
                    this._invalidLocationIndicator.graphics.clear();
                    this.ticker.requestUpdate();
                }
                return this;
            };

            public clear = () : this => {
                this._debugArea.graphics.clear();
                this._invalidLocationIndicator.graphics.clear();
                this.stage.removeChild(this.template);
                this.stage.update();
                return this;
            };

            public moveTo = (x: number, y: number) : this => {
                this.template.x = x;
                this.template.y = y;
                return this;
            };

            public setLocation = (x: number, y: number) : this => {
                this.location.x = x;
                this.location.y = y;
                return this;
            };

            public debug = () : this => {
                let shipPosition = this.getPosition();

                this._debugArea.graphics.clear();

                this._debugArea
                    .graphics
                    .setStrokeStyle(1)
                    .beginStroke(this.constants.get('colors').black)
                    .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                    .endStroke();

                if (!this._debugArea.parent) {
                    this.stage.addChild(this._debugArea);
                }
                return this;
            };

            public rotate = (angle: number = 0, center?: number) : this => {
                this.template.regX = this.template.image.width / (center || 0) | 0;
                this.template.regY = this.template.image.height / (center || 0) | 0;
                this.template.rotation = (angle || 0);
                return this;
            };

            public init = () : this => {
                if (bs.utils.isFunction(this._updateListener)) {
                    this._updateListener();
                }

                let self = this;
                this._updateListener = this.ticker.notifyOnUpdate(function (event) {
                    self.draw(event);
                });


                bs.events.on(_enum.events.ship.freeze, _freeze);

                return this;
            };

            public getPosition = () : any => {
                let _line = this.constants.get('line');
                let _orientation = this.constants.get('orientation');
                return {
                    x: this.location.x * _line.size.width,
                    y: this.location.y * _line.size.height,
                    w: (this.orientation === _orientation.horizontal ? this.length : 1) * _line.size.width,
                    h: (this.orientation === _orientation.vertical   ? this.length : 1) * _line.size.height
                };
            };

            public red = () : this => {
                this.template.filters = [ _redFilter ];
                _templateCache(this.template);
                this.ticker.requestUpdate();
                return this;
            };

            public green = () : this => {
                this.template.filters = [ _greenFilter ];
                _templateCache(this.template);
                this.ticker.requestUpdate();
                return this;
            };

            public black = () : this => {
                this.template.filters = [ _blackFilter ];
                _templateCache(this.template);
                this.ticker.requestUpdate();
                return this;
            };

            public draw = (event?: Event) : this => {
                let shipPosition = this.getPosition(),
                    aspectRatio = null;

                if(bs._data.debugEnabled) {
                    this.debug();
                }

                if (this.orientation === this.constants.get('orientation').vertical) {

                    aspectRatio = bs.utils.getAspectRatioFit(this.template.image.height, this.template.image.width, shipPosition.w, shipPosition.h);

                    this.rotate(270, 1);
                    this.moveTo(
                        shipPosition.x + ((shipPosition.w + aspectRatio.width) / 2),
                        shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
                    );

                } else {

                    aspectRatio = bs.utils.getAspectRatioFit(this.template.image.width, this.template.image.height, shipPosition.w, shipPosition.h);

                    this.rotate(0);
                    this.moveTo(
                        shipPosition.x + ((shipPosition.w - aspectRatio.width) / 2),
                        shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
                    );

                }

                this.setScale(aspectRatio.ratio);

                if (!this.template.parent) {
                    this.stage.addChild(this.template);
                }

                this.stage.update(event);
                return this;
            };

            public setScale = (scale: number) : this => {
                this.scale = this.template.scaleX = this.template.scaleY = scale;
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _freeze() {
            _frozen = true;
        }

        function _shipSelected(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            this.offset = {
                x: this.x - event.stageX,
                y: this.y - event.stageY
            };
        }

        function _shipClicked(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen || ship.beingDragged) {
                return;
            }

            if (ship.orientation === ship.constants.get('orientation').vertical) {
                ship.orientation = ship.constants.get('orientation').horizontal;
            }
            else { ship.orientation = ship.constants.get('orientation').vertical; }

            bs.events.broadcast(_enum.events.ship.moved);
        }

        function _shipMoved(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            ship.beingDragged = true;

            let x = event.stageX + this.offset.x,
                y = event.stageY + this.offset.y,
                abs = ship.absoluteToRelativeCoordinates(x, y);

            if (ship.location.x !== abs.x || ship.location.y !== abs.y) {

                let _ship = {
                    orientation: ship.orientation,
                    length: ship.length,
                    location: {
                        x: abs.x,
                        y: abs.y
                    }
                };

                if (ship.hasValidMap() && ship.map.locationIsWithinMap(_ship)) {
                    ship.moveTo(x, y);
                    ship.setLocation(abs.x, abs.y);
                    bs.events.broadcast(_enum.events.ship.moved);
                }
            }
        }

        function _shipUnselected(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            ship.beingDragged = false;
            bs.events.broadcast(_enum.events.ship.moved);
        }

        function _shipHovered(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            if (!ship._invalidLocation) {
                ship.green();
            }
        }

        function _shipUnhovered(event, ship) {
            // IMPORTANT NOTE: The this instance refers to this.template
            if (_frozen) {
                return;
            }

            if (!ship._invalidLocation) {
                ship.black();
            }
        }

        function _templateCache(template) {
            if (!bs.utils.isElement(template.image)) {
                return;
            }

            if (template.alreadyCached) {
                template.updateCache();
            } else {
                template.alreadyCached = true;
                template.cache(template.x, template.y, template.image.width, template.image.height);
            }
        }

    }

}
