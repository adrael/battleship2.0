/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _enum: any = {
            MAP: 'MAP',
            PLAYER: 'PLAYER',
            OPPONENT: 'OPPONENT'
        };

        let _self: any = null;
        let _turn: string = _enum.PLAYER;
        let _picture: createjs.Bitmap = null;
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
                bs.events.on('BS::TURN::PLAYER', this.playerTurn);
                bs.events.on('BS::TURN::OPPONENT', this.opponentTurn);
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public playerTurn = () : this => {
                return _changeTurnTo(_enum.PLAYER);
            };

            public opponentTurn = () : this => {
                return _changeTurnTo(_enum.OPPONENT);
            };

            public drawGrid = () : this => {
                _drawGrid();
                if (_turn === _enum.PLAYER) {
                    return _drawPicture(_enum.PLAYER, 1.4);
                }
                return _drawPicture(_enum.MAP, 1.4);
            };

            public clear = () : this => {
                _flushChildren();
                this.stage.update();
                return this;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _changeTurnTo(turn: string) {
            if (_turn !== turn) {
                _turn = turn;
                _self.drawGrid();
            }
            return _self;
        }

        function _drawPicture(name: string, scale: number = 1) {
            if (!bs.utils.isNull(_picture) && bs.utils.isDefined(_picture.parent)) {
                _self.stage.removeChild(_picture);
            }
            _picture = _getBitmapPictureOf(name, scale);
            _children.push(_picture);
            _self.stage.addChild(_picture);
            _self.stage.update();
            return _self;
        }

        function _getBitmapPictureOf(name: string, scale: number = 1) : createjs.Bitmap {
            let bitmap = new createjs.Bitmap(bs._data.preload.getResult(name)),
                _line = _self.constants.get('line'),
                lineWidth = _line.size.width,
                lineHeight = _line.size.height,
                logoScale = (lineWidth / bitmap.image.width) / scale;

            bitmap.x = bitmap.y = (lineWidth - bitmap.image.width * logoScale) / 2;
            bitmap.scaleX = bitmap.scaleY = logoScale;

            return bitmap;
        }

        function _flushChildren() {
            bs.utils.forEach(_children, function (child) {
                _self.stage.removeChild(child);
            });
            return _self;
        }

        function _drawGrid() {

            if (_children.length > 0) {
                _flushChildren();
            }

            // Drawing board
            let _line = _self.constants.get('line'),
                _map = _self.constants.get('map'),
                _canvas = _self.constants.get('canvas'),
                _colors = _self.constants.get('colors'),
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
                _self.stage.addChild(lineShape);
                _self.stage.addChild(rectShape);

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
                    _self.stage.addChild(verticalIndexText);
                    _self.stage.addChild(horizontalIndexText);

                }

            }

            _self.stage.update();

            return _self;
        }

    }

}
