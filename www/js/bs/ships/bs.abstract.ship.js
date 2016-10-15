(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.ships = (window.bs.ships || {});

    window.bs.ships.Ship = Ship;

    /**********************************************************************************/
    /*                                                                                */
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _self = null,
        _redFilter = new createjs.ColorFilter(0,0,0,1, 255,0,0,0),
        _blackFilter = new createjs.ColorFilter(0,0,0,1, 0,0,0,0),
        _updateGraphics = false;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Ship() {

        _self = this;

        this.name = 'ABSTRACT_SHIP';
        this.length = 0;
        this.template = null;
        this.location = { x: 0, y: 0 };
        this.isSetOnMap = false;
        this.orientation = this.constants.orientation.horizontal;

        this.setTemplate(new createjs.Bitmap())

    }

    Ship.prototype = new bs.core.Core();
    Ship.prototype.constructor = Ship;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Ship.prototype.setTemplate = function setTemplate(template) {

        _self = this;

        _self.template = template;
        _self.template.name = _self.name;
        _self.template.cursor = 'pointer';
        _self.template.filters = [ _blackFilter ];

        if (bs.utils.isElement(_self.template.image)) {
            _self.template.cache(_self.template.x, _self.template.y, _self.template.image.width, _self.template.image.height);
        }

        this.template.on('pressup',   _shipUnselected);
        this.template.on('rollout',   _shipUnhovered);
        this.template.on('rollover',  _shipHovered);
        this.template.on('pressmove', _shipMoved);
        this.template.on('mousedown', _shipSelected);

        createjs.Ticker.addEventListener('tick', _updateShipGraphics);

    };

    Ship.prototype.setName = function setName(name) {
        this.name = this.template.name = name;
    };

    Ship.prototype.clear = function clear() {
        this.template.graphics.clear();

        if (this.isSetOnMap) {
            this.stage.update();
        }
    };

    Ship.prototype.moveTo = function moveTo(x, y) {
        this.template.x = x;
        this.template.y = y;

        if (this.isSetOnMap) {
            this.stage.update();
        }
    };

    Ship.prototype.rotate = function rotate(angle, center) {
        this.template.regX = this.template.image.width / (center || 0) | 0;
        this.template.regY = this.template.image.height / (center || 0) | 0;
        this.template.rotation = (angle || 0);
    };

    Ship.prototype.init = function init(template, x, y) {
        if (bs.utils.isElement(template)) {
            this.setTemplate(new createjs.Bitmap(template));
        }

        if (bs.utils.isNumber(x) && bs.utils.isNumber(y)) {
            this.moveTo(x, y);
        }
    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _shipSelected(event) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.parent.addChild(this);
        this.offset = {x: this.x - event.stageX, y: this.y - event.stageY};
    }

    function _shipMoved(event) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.x = event.stageX + this.offset.x;
        this.y = event.stageY + this.offset.y;
        _updateGraphics = true;

        // TODO: Snap ship to grid here
    }

    function _shipHovered(event) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.filters = [ _redFilter ];
        this.updateCache();
        _updateGraphics = true;
    }

    function _shipUnhovered(event) {
        // IMPORTANT NOTE: The this instance refers to this.template
        this.filters = [ _blackFilter ];
        this.updateCache();
        _updateGraphics = true;
    }

    function _shipUnselected(event) {
        // IMPORTANT NOTE: The this instance refers to this.template
    }

    function _updateShipGraphics(event) {
        // This set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (_updateGraphics) {
            _updateGraphics = false; // Only update the stage once
            _self.stage.update(event);
        }
    }

})();
