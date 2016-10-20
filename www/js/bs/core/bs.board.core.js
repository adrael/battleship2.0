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
    /*                              PRIVATE PROPERTIES                                */
    /*                                                                                */
    /**********************************************************************************/

    var _self = null,
        _children = [];

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    function Board() {
        _self = this;
    }

    Board.prototype = new bs.core.Core();
    Board.prototype.constructor = Board;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    Board.prototype.clear = function clear() {

        _flushChildren();
        _self.stage.update();

    };

    Board.prototype.drawGrid = function drawGrid() {

        if (_children.length > 0) {
            _flushChildren();
        }

        // Drawing board
        var lineWidth = _self.constants.line.size.width,
            lineHeight = _self.constants.line.size.height;

        for (var index = 0; index < _self.constants.line.count; ++index) {

            var lineShape = new createjs.Shape(),
                rectShape = new createjs.Shape(),
                currentVerticalPosition = (index * lineWidth),
                currentHorizontalPosition = (index * lineHeight);

            // Drawing grid lines
            lineShape
                .graphics
                .setStrokeStyle(.2)

                // Vertical line
                .beginStroke(_self.constants.colors.black)
                .moveTo(currentVerticalPosition, 0)
                .lineTo(currentVerticalPosition, _self.constants.canvas.size.width)
                .endStroke()

                // Horizontal line
                .beginStroke(_self.constants.colors.black)
                .moveTo(0, currentHorizontalPosition)
                .lineTo(_self.constants.canvas.size.height, currentHorizontalPosition)
                .endStroke();

            // Drawing grid indexes
            rectShape
                .graphics

                // Vertical index
                .beginFill(_self.constants.colors.black)
                .drawRect(currentVerticalPosition, 0, lineWidth, lineHeight)
                .endFill()

                // Horizontal index
                .beginFill(_self.constants.colors.black)
                .drawRect(0, currentHorizontalPosition, lineWidth, lineHeight)
                .endFill();

            _children.push(lineShape);
            _children.push(rectShape);
            _self.stage.addChild(lineShape);
            _self.stage.addChild(rectShape);

            // Drawing indexes text
            if (index > 0) {

                var textScale = (lineWidth / 2),
                    verticalText = _self.constants.map.indexes.vertical[index - 1],
                    horizontalText = _self.constants.map.indexes.horizontal[index - 1],
                    verticalIndexText = new createjs.Text(verticalText, textScale + 'px Arial', _self.constants.colors.white),
                    horizontalIndexText = new createjs.Text(horizontalText, textScale + 'px Arial', _self.constants.colors.white);

                verticalIndexText.x = (currentVerticalPosition + lineWidth / 2 - verticalIndexText.getBounds().width / 2);
                verticalIndexText.y = (lineHeight / 2);
                verticalIndexText.textBaseline = 'middle';

                horizontalIndexText.x = (lineWidth / 2 - horizontalIndexText.getBounds().width / 2);
                horizontalIndexText.y = (currentHorizontalPosition + lineHeight / 2);
                horizontalIndexText.textBaseline = 'middle';

                _children.push(verticalIndexText);
                _children.push(horizontalIndexText);
                _self.stage.addChild(verticalIndexText);
                _self.stage.addChild(horizontalIndexText);

            }

        }

        // Drawing logo
        var logo = new createjs.Bitmap(window._bs._preload.getResult('LOGO')),
            logoScale = lineWidth / logo.image.width;

        logo.x = logo.y = (lineWidth - logo.image.width * logoScale) / 2;
        logo.scaleX = logo.scaleY = logo.scale = logoScale;

        _children.push(logo);
        _self.stage.addChild(logo);

        _self.stage.update();

    };

    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/

    function _flushChildren() {
        bs.utils.forEach(_children, function (child) {
            _self.stage.removeChild(child);
        });
    }

})();
