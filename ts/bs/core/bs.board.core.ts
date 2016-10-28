/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _self: any = null;
        let _enum: any = null;
        let _turn: string = null;
        let _mark: createjs.Bitmap = null;
        let _target: createjs.Bitmap = null;
        let _picture: createjs.Bitmap = null;
        let _children: Array<any> = [];
        let _gameStarted: boolean = false;
        let _mouseOverArea: createjs.Shape = new createjs.Shape();

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
                _enum = this.constants.get('enum');
                _turn = _enum.names.player;
                bs.events.on(_enum.events.bomb.hit, _shotFired);
                bs.events.on(_enum.events.game.playerTurn, this.playerTurn);
                bs.events.on(_enum.events.game.opponentTurn, this.opponentTurn);

                this.stage.addEventListener('stagemousedown', _mouseDown);
                this.stage.addEventListener('stagemousemove', _mouseMove);

                bs.events.on(_enum.events.game.started, () => { _gameStarted = true; });

                _mark = new createjs.Bitmap(bs._data.preload.getResult('MARK'));
                _mark.filters = [ new createjs.ColorFilter(0,0,0,1, 54,57,59,0) ];
                _templateCache(_mark);

                _target = new createjs.Bitmap(bs._data.preload.getResult('TARGET'));
                _templateCache(_target);
            }

            /**********************************************************************************/
            /*                                                                                */
            /*                                PUBLIC MEMBERS                                  */
            /*                                                                                */
            /**********************************************************************************/

            public playerTurn = () : this => {
                return _changeTurnTo(_enum.names.player);
            };

            public opponentTurn = () : this => {
                return _changeTurnTo(_enum.names.opponent);
            };

            public drawGrid = () : this => {
                _drawGrid();
                if (_turn === _enum.names.player) {
                    return _drawPicture(_enum.names.player, 1.4);
                }
                return _drawPicture(_enum.names.map, 1.4);
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

        function _shotFired() {
            _self.stage.removeChild(_mark);
            _self.stage.removeChild(_target);
            _self.stage.removeChild(_mouseOverArea);
            _self.stage.update();
        }

        function _mouseDown(event) {
            if (!_gameStarted || _turn !== _enum.names.player) {
                return _self;
            }

            let abs = _self.absoluteToRelativeCoordinates(_self.stage.mouseX, _self.stage.mouseY);

            if (abs.x <= 0 || abs.y <= 0) {
                return _self;
            }

            let rel = _self.relativeToAbsoluteCoordinates(abs.x, abs.y),
                _line = _self.constants.get('line'),
                aspectRatio = <any>bs.utils.getAspectRatioFit(_mark.image.width, _mark.image.height, _line.size.width, _line.size.height);

            _mark.scaleX = _mark.scaleY = aspectRatio.ratio;

            _mark.x = rel.x;
            _mark.y = rel.y;

            if (!_mark.parent) {
                _self.stage.addChild(_mark);
            }

            _self.stage.update(event);

            bs.events.broadcast(_enum.events.bomb.selected, abs);

            return _self;
        }

        function _mouseMove(event) {
            if (!_gameStarted || _turn !== _enum.names.player) {
                return _self;
            }

            let abs = _self.absoluteToRelativeCoordinates(_self.stage.mouseX, _self.stage.mouseY);

            if (abs.x <= 0 || abs.y <= 0) {
                return _self;
            }

            let rel = _self.relativeToAbsoluteCoordinates(abs.x, abs.y),
                _line = _self.constants.get('line'),
                aspectRatio = <any>bs.utils.getAspectRatioFit(_target.image.width, _target.image.height, _line.size.width, _line.size.height);

            _target.scaleX = _target.scaleY = aspectRatio.ratio;

            _target.x = rel.x;
            _target.y = rel.y;

            _mouseOverArea.graphics.clear();

            _mouseOverArea
                .graphics
                .setStrokeStyle(1)
                .beginFill(_self.constants.get('colors').white)
                .drawRect(rel.x, rel.y, _line.size.width, _line.size.height)
                .endFill();

            _mouseOverArea.alpha = .5;
            _mouseOverArea.cursor = 'pointer';

            if (!_mouseOverArea.parent) {
                _self.stage.addChild(_mouseOverArea);
            }

            if (!_target.parent) {
                _self.stage.addChild(_target);
            }

            _self.stage.update(event);

            return _self;
        }

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

        function _templateCache(template) {
            if (!bs.utils.isElement(template.image)) {
                return;
            }

            if (template.alreadyCached) {
                template.updateCache();
            } else {
                template.alreadyCached = true;
                template.cache(template.x, template.y, template.image.width, template.image.height);
            }
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
