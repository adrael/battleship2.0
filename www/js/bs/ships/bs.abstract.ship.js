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



    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Ship() {

        this.name = 'ABSTRACT_SHIP';
        this.length = 0;
        this.template = new createjs.Bitmap();
        this.location = { x: 0, y: 0 };
        this.isSetOnMap = false;
        this.orientation = this.constants.orientation.horizontal;

    }

    Ship.prototype = new bs.Core();
    Ship.prototype.constructor = Ship;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Ship.prototype.setTemplate = function setTemplate(template) {
        this.template = template;
        this.template.name = this.name;
        this.template.cursor = 'pointer';

        var self = this,
            update = false;

        this.template.on('mousedown', function (evt) {
            console.log('mousedown on', self.name);
            this.parent.addChild(this);
            this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
        });

        this.template.on('pressup', function (evt) {
            console.log('pressup on', self.name);
        });

        this.template.on("pressmove", function (evt) {
            this.x = evt.stageX + this.offset.x;
            this.y = evt.stageY + this.offset.y;
            // indicate that the stage should be updated on the next tick:
            update = true;
        });

        this.template.on("rollover", function (evt) {
            console.log('rollover on', self.name);
        });

        this.template.on("rollout", function (evt) {
            console.log('rollout on', self.name);
        });

        createjs.Ticker.addEventListener("tick", function tick(event) {
            // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
            if (update) {
                update = false; // only update once
                self.stage.update(event);
            }
        });
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



})();
