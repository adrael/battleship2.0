(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.ships = (window.bs.ships || {});

    window.bs.ships.AbstractShip = AbstractShip;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _registeredShips = [],
        _redFilter   = new createjs.ColorFilter(0,0,0,1, 238,64,0,0),
        _greenFilter = new createjs.ColorFilter(0,0,0,1, 0,139,69,0),
        _blackFilter = new createjs.ColorFilter(0,0,0,1, 54,57,59,0);

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function AbstractShip() {

        bs.core.Core.call(this);

        this.map = null;
        this.name = 'ABSTRACT_SHIP';
        this.drawn = false;
        this.length = 0;
        this.template = null;
        this.location = { x: 1, y: 1 };
        this.debugArea = new createjs.Shape();
        this.orientation = this.constants.orientation.horizontal;
        this.beingDragged = false;
        this.invalidLocation = false;
        this.invalidLocationIndicator = new createjs.Shape();

        if ((Math.random() * 100) > 50) {
            this.orientation = this.constants.orientation.vertical;
        }

    }

    AbstractShip.prototype = bs.core.Core.prototype;
    AbstractShip.prototype.constructor = AbstractShip;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    AbstractShip.prototype.setTemplate = function setTemplate(template) {

        this.template = template;
        this.template.name = this.name;
        this.template.cursor = 'pointer';
        this.template.filters = [ _blackFilter ];

        var self = this;
        this.template.on('click',     function (event) { _shipClicked.call(this, event, self); });
        this.template.on('pressup',   function (event) { _shipUnselected.call(this, event, self); });
        this.template.on('rollout',   function (event) { _shipUnhovered.call(this, event, self); });
        this.template.on('rollover',  function (event) { _shipHovered.call(this, event, self); });
        this.template.on('pressmove', function (event) { _shipMoved.call(this, event, self); });
        this.template.on('mousedown', function (event) { _shipSelected.call(this, event, self); });

        _templateCache(this.template);

        return this;

    };

    AbstractShip.prototype.setName = function setName(name) {
        var index = 1,
            _name = name;
        while (_registeredShips.indexOf(_name) !== -1) {
            _name = name + '#' + index
        }

        _registeredShips.push(_name);
        this.name = _name;
        if (this.template) {
            this.template.name = _name;
        }

        return this;
    };

    AbstractShip.prototype.setMap = function setMap(map) {
        if (!map instanceof bs.core.Map) {
            this.map = null
        } else {
            this.map = map;
        }
        return this;
    };

    AbstractShip.prototype.hasValidMap = function hasValidMap() {
        return this.map instanceof bs.core.Map;

    };

    AbstractShip.prototype.doLocationCheck = function doLocationCheck() {
        this.clearLocationCheck();

        if (this.hasValidMap() && !this.map.isShipLocationValid(this)) {

            var shipPosition = this.getPosition();

            this.invalidLocationIndicator
                .graphics
                .setStrokeStyle(1)
                .beginFill(this.constants.colors.red)
                .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                .endFill();

            this.invalidLocationIndicator.alpha = .3;

            if (!this.invalidLocationIndicator.activated) {
                this.invalidLocationIndicator.activated = true;
                this.stage.addChild(this.invalidLocationIndicator);
            }

            this.red();
            this.invalidLocation = true;
            this.ticker.requestUpdate();

        }

        return this;
    };

    AbstractShip.prototype.clearLocationCheck = function clearLocationCheck() {
        if (this.invalidLocation) {
            this.black();
            this.invalidLocation = false;
            this.invalidLocationIndicator.graphics.clear();
            this.ticker.requestUpdate();
        }
        return this;
    };

    AbstractShip.prototype.clear = function clear() {
        this.debugArea.graphics.clear();
        this.clearLocationCheck();
        this.ticker.requestUpdate();
        return this;
    };

    AbstractShip.prototype.moveTo = function moveTo(x, y) {
        this.template.x = x;
        this.template.y = y;
        return this;
    };

    AbstractShip.prototype.setLocation = function setLocation(x, y) {

        var oldShip = {
            name: this.name,
            location: bs.utils.merge({}, this.location),
            length: this.length,
            orientation: this.orientation
        };

        this.location.x = x;
        this.location.y = y;

        if (this.hasValidMap()) {
            this.map.moveShip(oldShip, this);
        }
        return this;
    };

    AbstractShip.prototype.debug = function debug() {
        var shipPosition = this.getPosition();

        this.debugArea.graphics.clear();

        this.debugArea
            .graphics
            .setStrokeStyle(1)
            .beginStroke(this.constants.colors.black)
            .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
            .endStroke();

        if (!this.debugArea.activated) {
            this.debugArea.activated = true;
            this.stage.addChild(this.debugArea);
        }
        return this;
    };

    AbstractShip.prototype.rotate = function rotate(angle, center) {
        this.template.regX = this.template.image.width / (center || 0) | 0;
        this.template.regY = this.template.image.height / (center || 0) | 0;
        this.template.rotation = (angle || 0);
        return this;
    };

    AbstractShip.prototype.init = function init(template) {

        if (bs.utils.isElement(template)) {
            this.setTemplate(new createjs.Bitmap(template));
        }

        if (bs.utils.isFunction(this.updateListener)) {
            this.updateListener();
        }

        var self = this;
        this.updateListener = this.ticker.notifyOnUpdate(function (event) {
            self.draw(event);
        });

        return this;

    };

    AbstractShip.prototype.getPosition = function getPosition() {
        return {
            x: this.location.x * this.constants.line.size.width,
            y: this.location.y * this.constants.line.size.height,
            w: (this.orientation === this.constants.orientation.horizontal ? this.length : 1) * this.constants.line.size.width,
            h: (this.orientation === this.constants.orientation.vertical   ? this.length : 1) * this.constants.line.size.height
        };
    };

    AbstractShip.prototype.red = function red() {
        this.template.filters = [ _redFilter ];
        _templateCache(this.template);
        this.ticker.requestUpdate();
        return this;
    };

    AbstractShip.prototype.green = function green() {
        this.template.filters = [ _greenFilter ];
        _templateCache(this.template);
        this.ticker.requestUpdate();
        return this;
    };

    AbstractShip.prototype.black = function black() {
        this.template.filters = [ _blackFilter ];
        _templateCache(this.template);
        this.ticker.requestUpdate();
        return this;
    };

    AbstractShip.prototype.draw = function draw(event) {

        var shipPosition = this.getPosition(),
            aspectRatio = null;

        if(/*__debugEnabled__*/ true /*__debugEnabled__*/) {
            this.debug();
        }

        if (this.orientation === this.constants.orientation.vertical) {

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

        this.template.scaleX = this.template.scaleY = this.template.scale = aspectRatio.ratio;

        if (!this.drawn) {
            this.drawn = true;
            this.stage.addChild(this.template);
        }

        this.stage.update(event);
        return this;

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _shipSelected(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.offset = {
            x: this.x - event.stageX,
            y: this.y - event.stageY
        };
    }

    function _shipClicked(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        if (ship.beingDragged) {
            return;
        }

        var oldShip = {
            name: ship.name,
            location: bs.utils.merge({}, ship.location),
            length: ship.length,
            orientation: ship.orientation
        };

        if (ship.orientation === ship.constants.orientation.vertical) {
            ship.orientation = ship.constants.orientation.horizontal;
        }
        else { ship.orientation = ship.constants.orientation.vertical; }

        if (ship.hasValidMap()) {
            ship.map.moveShip(oldShip, ship);
        }

        bs.events.broadcast('BS::SHIP::MOVED');
    }

    function _shipMoved(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        ship.beingDragged = true;

        var x = event.stageX + this.offset.x,
            y = event.stageY + this.offset.y,
            abs = ship.absoluteToRelativeCoordinates(x, y);

        if (ship.location.x !== abs.x || ship.location.y !== abs.y) {

            var _ship = {
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
                bs.events.broadcast('BS::SHIP::MOVED');
            }
        }
    }

    function _shipUnselected(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        ship.beingDragged = false;
        bs.events.broadcast('BS::SHIP::MOVED');
    }

    function _shipHovered(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        if (!ship.invalidLocation) {
            ship.green();
        }
    }

    function _shipUnhovered(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        if (!ship.invalidLocation) {
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

})();
