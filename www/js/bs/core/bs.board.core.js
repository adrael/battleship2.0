(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.core = (window.bs.core || {});

    window.bs.core.Board = Board;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Board() {}
    Board.prototype = new bs.core.Core();
    Board.prototype.constructor = Board;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Board.prototype.clear = function clear() {

        this.stage.removeAllChildren();
        this.stage.update();

    };

    Board.prototype.drawShip = function drawShip(ship) {

        var shipPosition = {
                x: ship.location.x * this.constants.line.size.width,
                y: ship.location.y * this.constants.line.size.height,
                w: (ship.orientation === this.constants.orientation.horizontal ? ship.length : 1) * this.constants.line.size.width,
                h: (ship.orientation === this.constants.orientation.vertical   ? ship.length : 1) * this.constants.line.size.height
            },
            aspectRatio = null;

        if(/*__debugEnabled__*/ true /*__debugEnabled__*/) {

            var border = new createjs.Shape();
            border
                .graphics
                .setStrokeStyle(1)
                .beginStroke(this.constants.colors.black)
                .drawRect(shipPosition.x, shipPosition.y, shipPosition.w, shipPosition.h)
                .endStroke();

            this.stage.addChild(border);
        }

        if (ship.orientation === this.constants.orientation.vertical) {

            aspectRatio = bs.utils.getAspectRatioFit(ship.template.image.height, ship.template.image.width, shipPosition.w, shipPosition.h);

            ship.rotate(270, 1);
            ship.moveTo(
                shipPosition.x + ((shipPosition.w + aspectRatio.width) / 2),
                shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
            );

        } else {

            aspectRatio = bs.utils.getAspectRatioFit(ship.template.image.width, ship.template.image.height, shipPosition.w, shipPosition.h);

            ship.moveTo(
                shipPosition.x + ((shipPosition.w - aspectRatio.width) / 2),
                shipPosition.y + ((shipPosition.h - aspectRatio.height) / 2)
            );

        }

        ship.template.scaleX = ship.template.scaleY = ship.template.scale = aspectRatio.ratio;

        this.stage.addChild(ship.template);
        this.stage.update();

    };

    Board.prototype.drawGrid = function drawGrid() {

        // Drawing board
        var lineWidth = this.constants.line.size.width,
            lineHeight = this.constants.line.size.height;

        for (var index = 0; index < this.constants.line.count; ++index) {

            var lineShape = new createjs.Shape(),
                rectShape = new createjs.Shape(),
                currentVerticalPosition = (index * lineWidth),
                currentHorizontalPosition = (index * lineHeight);

            // Drawing grid lines
            lineShape
                .graphics
                .setStrokeStyle(.2)

                // Vertical line
                .beginStroke(this.constants.colors.black)
                .moveTo(currentVerticalPosition, 0)
                .lineTo(currentVerticalPosition, this.constants.canvas.size.width)
                .endStroke()

                // Horizontal line
                .beginStroke(this.constants.colors.black)
                .moveTo(0, currentHorizontalPosition)
                .lineTo(this.constants.canvas.size.height, currentHorizontalPosition)
                .endStroke();

            // Drawing grid indexes
            rectShape
                .graphics

                // Vertical index
                .beginFill(this.constants.colors.black)
                .drawRect(currentVerticalPosition, 0, lineWidth, lineHeight)
                .endFill()

                // Horizontal index
                .beginFill(this.constants.colors.black)
                .drawRect(0, currentHorizontalPosition, lineWidth, lineHeight)
                .endFill();

            this.stage.addChild(lineShape);
            this.stage.addChild(rectShape);

            // Drawing indexes text
            if (index > 0) {

                var verticalText = this.constants.map.indexes.vertical[index - 1],
                    horizontalText = this.constants.map.indexes.horizontal[index - 1],
                    verticalIndexText = new createjs.Text(verticalText, '16pt Arial', this.constants.colors.white),
                    horizontalIndexText = new createjs.Text(horizontalText, '16pt Arial', this.constants.colors.white);

                verticalIndexText.x = (currentVerticalPosition + lineWidth / 2 - verticalIndexText.getBounds().width / 2);
                verticalIndexText.y = (lineHeight / 2);
                verticalIndexText.textBaseline = 'middle';

                horizontalIndexText.x = (lineWidth / 2 - horizontalIndexText.getBounds().width / 2);
                horizontalIndexText.y = (currentHorizontalPosition + lineHeight / 2);
                horizontalIndexText.textBaseline = 'middle';

                this.stage.addChild(verticalIndexText);
                this.stage.addChild(horizontalIndexText);

            }

        }

        this.stage.update();

        // Drawing logo
        var self = this,
            logo = new createjs.Bitmap('img/logo.png');

        logo.x = logo.y = 0;
        logo.scaleX = logo.scaleY = logo.scale = .4;

        logo.image.onload = function () {
            self.stage.addChild(logo);
            self.stage.update();
        };

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



})();
