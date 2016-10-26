/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _self: any = null;
        let _children: Array<any> = [];

        export class Board extends bs.core.Core{

            /**********************************************************************************/
            /*                                                                                */
            /*                                  PROPERTIES                                    */
            /*                                                                                */
            /**********************************************************************************/



            /**********************************************************************************/
            /*                                                                                */
            /*                                  CONSTRUCTOR                                   */
            /*                                                                                */
            /**********************************************************************************/

            constructor() {
                super();
                _self = this;
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public clear = () : this => {
                _flushChildren();
                this.stage.update();
                return this;
            };

            public drawGrid = () : this => {
                if (_children.length > 0) {
                    _flushChildren();
                }

                // Drawing board
                var _line = this.constants.get('line'),
                    _map = this.constants.get('map'),
                    _canvas = this.constants.get('canvas'),
                    _colors = this.constants.get('colors'),
                    lineWidth = _line.size.width,
                    lineHeight = _line.size.height;

                for (let index = 0; index < _line.count; ++index) {

                    let lineShape = new createjs.Shape(),
                        rectShape = new createjs.Shape(),
                        currentVerticalPosition = (index * lineWidth),
                        currentHorizontalPosition = (index * lineHeight);

                    // Drawing grid lines
                    lineShape
                        .graphics
                        .setStrokeStyle(.2)

                        // Vertical line
                        .beginStroke(_colors.black)
                        .moveTo(currentVerticalPosition, 0)
                        .lineTo(currentVerticalPosition, _canvas.size.width)
                        .endStroke()

                        // Horizontal line
                        .beginStroke(_colors.black)
                        .moveTo(0, currentHorizontalPosition)
                        .lineTo(_canvas.size.height, currentHorizontalPosition)
                        .endStroke();

                    // Drawing grid indexes
                    rectShape
                        .graphics

                        // Vertical index
                        .beginFill(_colors.black)
                        .drawRect(currentVerticalPosition, 0, lineWidth, lineHeight)
                        .endFill()

                        // Horizontal index
                        .beginFill(_colors.black)
                        .drawRect(0, currentHorizontalPosition, lineWidth, lineHeight)
                        .endFill();

                    _children.push(lineShape);
                    _children.push(rectShape);
                    this.stage.addChild(lineShape);
                    this.stage.addChild(rectShape);

                    // Drawing indexes text
                    if (index > 0) {

                        let textScale = (lineWidth / 2),
                            verticalText = _map.indexes.vertical[index - 1],
                            horizontalText = _map.indexes.horizontal[index - 1],
                            verticalIndexText = new createjs.Text(verticalText, textScale + 'px Arial', _colors.white),
                            horizontalIndexText = new createjs.Text(horizontalText, textScale + 'px Arial', _colors.white);

                        verticalIndexText.x = (currentVerticalPosition + lineWidth / 2 - verticalIndexText.getBounds().width / 2);
                        verticalIndexText.y = (lineHeight / 2);
                        verticalIndexText.textBaseline = 'middle';

                        horizontalIndexText.x = (lineWidth / 2 - horizontalIndexText.getBounds().width / 2);
                        horizontalIndexText.y = (currentHorizontalPosition + lineHeight / 2);
                        horizontalIndexText.textBaseline = 'middle';

                        _children.push(verticalIndexText);
                        _children.push(horizontalIndexText);
                        this.stage.addChild(verticalIndexText);
                        this.stage.addChild(horizontalIndexText);

                    }

                }

                // Drawing logo
                let logo = new createjs.Bitmap(bs._.preload.getResult('LOGO')),
                    logoScale = lineWidth / logo.image.width;

                logo.x = logo.y = (lineWidth - logo.image.width * logoScale) / 2;
                logo.scaleX = logo.scaleY = logoScale;

                _children.push(logo);
                this.stage.addChild(logo);

                this.stage.update();
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _flushChildren() {
            bs.utils.forEach(_children, function (child) {
                _self.stage.removeChild(child);
            });
            return _self;
        }

    }

}
