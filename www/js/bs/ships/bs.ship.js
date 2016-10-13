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

    var _shipShape = new createjs.Bitmap();

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Ship() {

        this.name = 'ABSTRACT_SHIP';
        this.length = 0;
        this.template = null;
        this.location = { x: 0, y: 0 };
        this.orientation = this.constants.orientation.horizontal;

        _shipShape.x = this.location.x;
        _shipShape.y = this.location.y;
        _shipShape.name = this.name;
        _shipShape.cursor = 'pointer';

    }

    Ship.prototype = new bs.Core();
    Ship.prototype.constructor = Ship;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Ship.prototype.setName = function setName(name) {
        this.name = _shipShape.name = name;
    };

    Ship.prototype.clear = function clear() {
        _shipShape.graphics.clear();
        this.stage.update();
    };

    Ship.prototype.moveTo = function moveTo(x, y) {
        this.location.x = _shipShape.x = x;
        this.location.y = _shipShape.y = y;
        this.stage.update();
    };

    Ship.prototype.load = function load() {

        var self = this,
            ship = new createjs.Bitmap(this.template);

        ship.image.onload = function () {
            _shipShape.image = ship.image;
            self.draw();
        };

    };

    Ship.prototype.draw = function draw() {

        if (bs.utils.isDefined(_shipShape.image)) {

            //_shipShape.regX = _shipShape.image.width / 2 | 0;
            //_shipShape.regY = _shipShape.image.height / 2 | 0;

            // check for orientation
            //_shipShape.rotation = 360 * Math.random() | 0;

            //_shipShape.scaleX = _shipShape.scaleY = .4;

            this.stage.addChild(_shipShape);
            this.stage.update();

        }

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



})();
