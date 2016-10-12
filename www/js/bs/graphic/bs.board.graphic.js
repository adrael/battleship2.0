(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.graphic = (window.bs.graphic || {});
    window.bs.graphic.Board = Board;

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

    Board.prototype.drawGrid = function drawGrid() {

        // Drawing board
        var lineWidth = this.line.size.width,
            lineHeight = this.line.size.height;

        for (var index = 0; index < this.line.count; ++index) {

            var lineShape = new createjs.Shape(),
                rectShape = new createjs.Shape(),
                currentVerticalPosition = (index * lineWidth),
                currentHorizontalPosition = (index * lineHeight);

            // Drawing grid lines
            lineShape
                .graphics
                .setStrokeStyle(.2)

                // Vertical line
                .beginStroke(this.colors.black)
                .moveTo(currentVerticalPosition, 0)
                .lineTo(currentVerticalPosition, this.canvas.size.width)
                .endStroke()

                // Horizontal line
                .beginStroke(this.colors.black)
                .moveTo(0, currentHorizontalPosition)
                .lineTo(this.canvas.size.height, currentHorizontalPosition)
                .endStroke();

            // Drawing grid indexes
            rectShape
                .graphics

                // Vertical index
                .beginFill(this.colors.black)
                .drawRect(currentVerticalPosition, 0, lineWidth, lineHeight)
                .endFill()

                // Horizontal index
                .beginFill(this.colors.black)
                .drawRect(0, currentHorizontalPosition, lineWidth, lineHeight)
                .endFill();

            this.stage.addChild(lineShape);
            this.stage.addChild(rectShape);

        }

        this.stage.update();

        // Drawing logo
        var self = this,
            logo = new createjs.Bitmap('img/battleship.png');

        logo.x = logo.y = 0;
        logo.scaleX = logo.scaleY = .4;

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
