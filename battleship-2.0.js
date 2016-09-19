(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading game...');

    var constants = _setUpConstants();

    _drawGrid();
    _drawIndexes();

    function _drawIndexes() {

        var verticalIndexes = ' ,A,B,C,D,E,F,G,H,I,J'.split(','),
            horizontalIndexes = ' ,1,2,3,4,5,6,7,8,9,10'.split(','),
            context = constants.CANVAS.CONTEXT,
            squareHeight = constants.LINE.SIZE.HEIGHT,
            squareWidth = constants.LINE.SIZE.WIDTH;

        context.font = '16pt Arial';
        context.textBaseline = 'middle';

        console.debug('BATTLESHIP 2.0 - Drawing vertical indexes...');
        for (var verticalIndex = 0; verticalIndex < constants.LINE.NUM_OF_VERTICAL; ++verticalIndex) {
            var currentVerticalPosition = (verticalIndex * constants.LINE.SIZE.WIDTH);
            context.beginPath();
            context.fillStyle = constants.COLORS.BLACK;
            context.rect(currentVerticalPosition, 0, squareWidth, squareHeight);
            context.fill();
            context.stroke();

            var textVertical = verticalIndexes[verticalIndex],
                textVerticalX = currentVerticalPosition + squareWidth / 2 - context.measureText(textVertical).width / 2,
                textVerticalY = squareHeight / 2;

            context.fillStyle = constants.COLORS.WHITE;
            context.fillText(textVertical, textVerticalX, textVerticalY);
        }

        console.debug('BATTLESHIP 2.0 - Drawing horizontal indexes...');
        for (var horizontalIndex = 0; horizontalIndex < constants.LINE.NUM_OF_HORIZONTAL; ++horizontalIndex) {
            var currentHorizontalPosition = (horizontalIndex * constants.LINE.SIZE.HEIGHT);
            context.beginPath();
            context.fillStyle = constants.COLORS.BLACK;
            context.rect(0, currentHorizontalPosition, squareWidth, squareHeight);
            context.fill();
            context.stroke();

            var textHorizontal = horizontalIndexes[horizontalIndex],
                textHorizontalX = squareWidth / 2 - context.measureText(textHorizontal).width / 2,
                textHorizontalY = currentHorizontalPosition + squareHeight / 2;

            context.fillStyle = constants.COLORS.WHITE;
            context.fillText(textHorizontal, textHorizontalX, textHorizontalY);
        }

    }

    function _drawGrid() {

        var context = constants.CANVAS.CONTEXT;
        context.lineWidth = .2;
        context.strokeStyle = constants.COLORS.BLACK;

        console.debug('BATTLESHIP 2.0 - Drawing vertical grid lines...');
        for (var verticalLine = 1; verticalLine < constants.LINE.NUM_OF_VERTICAL; ++verticalLine) {
            var currentVerticalPosition = (verticalLine * constants.LINE.SIZE.WIDTH);
            context.beginPath();
            context.moveTo(currentVerticalPosition, 0);
            context.lineTo(currentVerticalPosition, constants.CANVAS.SIZE.HEIGHT);
            context.stroke();
        }

        console.debug('BATTLESHIP 2.0 - Drawing horizontal grid lines...');
        for (var horizontalLine = 1; horizontalLine < constants.LINE.NUM_OF_HORIZONTAL; ++horizontalLine) {
            var currentHorizontalPosition = (horizontalLine * constants.LINE.SIZE.HEIGHT);
            context.beginPath();
            context.moveTo(0, currentHorizontalPosition);
            context.lineTo(constants.CANVAS.SIZE.HEIGHT, currentHorizontalPosition);
            context.stroke();
        }

    }

    function _setUpConstants() {

        var _constants = {};

        _constants.COLORS = {};
        _constants.COLORS.WHITE = '#f8f8ff';
        _constants.COLORS.BLACK = '#36393B';

        _constants.CANVAS = {};
        _constants.CANVAS.CANVAS = document.getElementById('battlefield-container');
        _constants.CANVAS.CONTEXT = _constants.CANVAS.CANVAS.getContext('2d');
        _constants.CANVAS.SIZE = {};
        _constants.CANVAS.SIZE.WIDTH = _constants.CANVAS.CANVAS.scrollWidth;
        _constants.CANVAS.SIZE.HEIGHT = _constants.CANVAS.CANVAS.scrollHeight;

        _constants.LINE = {};
        _constants.LINE.NUM_OF_VERTICAL =  11;
        _constants.LINE.NUM_OF_HORIZONTAL =  11;
        _constants.LINE.SIZE = {};
        _constants.LINE.SIZE.WIDTH =  (_constants.CANVAS.SIZE.WIDTH / _constants.LINE.NUM_OF_VERTICAL);
        _constants.LINE.SIZE.HEIGHT =  (_constants.CANVAS.SIZE.HEIGHT / _constants.LINE.NUM_OF_HORIZONTAL);

        return _constants;

    }

})();