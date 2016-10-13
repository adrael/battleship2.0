(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.graphics = (window.bs.graphics || {});

    window.bs.graphics.Board = Board;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Board() {}
    Board.prototype = new bs.Core();
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
