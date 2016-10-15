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

    var _redFilter = new createjs.ColorFilter(0,0,0,1, 255,0,0,0),
        _blackFilter = new createjs.ColorFilter(0,0,0,1, 0,0,0,0);

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function AbstractShip() {

        this.name = 'ABSTRACT_SHIP';
        this.drawn = false;
        this.length = 0;
        this.template = null;
        this.location = { x: 0, y: 0 };
        this.debugArea = new createjs.Shape();
        this.orientation = this.constants.orientation.horizontal;

        if ((Math.random() * 100) > 50) {
            this.orientation = this.constants.orientation.vertical;
        }

        this.setTemplate(new createjs.Bitmap());

    }

    AbstractShip.prototype = new bs.core.Core();
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

        if (bs.utils.isElement(this.template.image)) {
            this.template.cache(this.template.x, this.template.y, this.template.image.width, this.template.image.height);
        }

        var self = this;

        this.template.on('pressup',   function (event) { _shipUnselected.call(this, event, self) });
        this.template.on('rollout',   function (event) { _shipUnhovered.call(this, event, self) });
        this.template.on('rollover',  function (event) { _shipHovered.call(this, event, self) });
        this.template.on('pressmove', function (event) { _shipMoved.call(this, event, self) });
        this.template.on('mousedown', function (event) { _shipSelected.call(this, event, self) });

    };

    AbstractShip.prototype.setName = function setName(name) {
        this.name = this.template.name = name;
    };

    AbstractShip.prototype.clear = function clear() {
        this.template.graphics.clear();
    };

    AbstractShip.prototype.moveTo = function moveTo(x, y) {
        this.template.x = x;
        this.template.y = y;
    };

    AbstractShip.prototype.debug = function debugAt() {

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

    };

    AbstractShip.prototype.rotate = function rotate(angle, center) {
        this.template.regX = this.template.image.width / (center || 0) | 0;
        this.template.regY = this.template.image.height / (center || 0) | 0;
        this.template.rotation = (angle || 0);
    };

    AbstractShip.prototype.init = function init(template, x, y) {

        var self = this;

        if (bs.utils.isElement(template)) {
            this.setTemplate(new createjs.Bitmap(template));
        }

        if (bs.utils.isNumber(x) && bs.utils.isNumber(y)) {
            this.moveTo(x, y);
        }

        if (bs.utils.isFunction(this.updateListener)) {
            this.updateListener();
        }

        this.updateListener = this.ticker.notifyOnUpdate(function (event) {
            self.draw(event);
        })

    };

    AbstractShip.prototype.getPosition = function getPosition() {
        return {
            x: this.location.x * this.constants.line.size.width,
            y: this.location.y * this.constants.line.size.height,
            w: (this.orientation === this.constants.orientation.horizontal ? this.length : 1) * this.constants.line.size.width,
            h: (this.orientation === this.constants.orientation.vertical   ? this.length : 1) * this.constants.line.size.height
        };
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

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _shipSelected(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.parent.addChild(this);
        this.offset = {x: this.x - event.stageX, y: this.y - event.stageY};
    }

    function _shipMoved(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template

        var abs = ship.absoluteToRelativeCoordinates(event.stageX + this.offset.x, event.stageY + this.offset.y);
        ship.location.x = abs.x;
        ship.location.y = abs.y;

        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;

        ship.ticker.requestUpdate();
    }

    function _shipUnselected(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template

        var abs = ship.absoluteToRelativeCoordinates(event.stageX + this.offset.x, event.stageY + this.offset.y);

        if (abs.x < 1) abs.x = 1;
        if (abs.y < 1) abs.y = 1;

        switch (ship.orientation) {

            case ship.constants.orientation.vertical:
                if (abs.y + ship.length >= ship.constants.line.count)
                    abs.y = ship.constants.line.count - ship.length;
                break;

            case ship.constants.orientation.horizontal:
                if (abs.x + ship.length >= ship.constants.line.count)
                    abs.x = ship.constants.line.count - ship.length;
                break;

        }

        ship.location.x = abs.x;
        ship.location.y = abs.y;

        var rel = ship.relativeToAbsoluteCoordinates(abs.x, abs.y);
        this.x = rel.x;
        this.y = rel.y;

        ship.ticker.requestUpdate();

    }

    function _shipHovered(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.filters = [ _redFilter ];
        this.updateCache();
        ship.ticker.requestUpdate();
    }

    function _shipUnhovered(event, ship) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.filters = [ _blackFilter ];
        this.updateCache();
        ship.ticker.requestUpdate();
    }

})();
