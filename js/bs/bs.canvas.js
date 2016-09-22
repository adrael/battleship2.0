(function () {

    'use strict';

    console.debug('BATTLESHIP 2.0 - Loading canvas...');

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    bs.canvas.fillRect = fillRect;
    bs.canvas.drawRect = drawRect;
    bs.canvas.drawLine = drawLine;
    bs.canvas.drawText = drawText;

    /**********************************************************************************/
    /*                                                                                */
    /*                               PUBLIC FUNCTIONS                                 */
    /*                                                                                */
    /**********************************************************************************/

    function drawText(text, position, color) {

        var requiredProperties = ['x', 'y'];

        try {

            if (!bs.utils.isString(text) || !text.trim().length) {
                throw new bs.exceptions.BSInvalidValueException(text, 'text');
            }

            bs.helpers.validObject(position, requiredProperties);

            var context = bs.constants.CANVAS.CONTEXT;
            context.fillStyle = color || bs.constants.COLORS.WHITE;
            context.fillText(text, position.x, position.y);

        } catch (exception) {

            bs.helpers.handleException(exception);

        }

    }

    function drawLine(from, to, width, color) {

        var requiredProperties = ['x', 'y'];

        try {

            bs.helpers.validObject(from, requiredProperties);
            bs.helpers.validObject(to, requiredProperties);

            var context = bs.constants.CANVAS.CONTEXT;
            context.lineWidth = width || 1;
            context.strokeStyle = color || bs.constants.COLORS.BLACK;
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.stroke();

        } catch (exception) {

            bs.helpers.handleException(exception);

        }

    }

    function fillRect(dimensions, color) {

        var requiredProperties = ['x', 'y', 'w', 'h'];

        try {

            bs.helpers.validObject(dimensions, requiredProperties);

            var context = bs.constants.CANVAS.CONTEXT;
            context.beginPath();
            context.fillStyle = color || bs.constants.COLORS.BLACK;
            context.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h);
            context.fill();
            context.stroke();

        } catch (exception) {

            bs.helpers.handleException(exception);

        }

    }

    function drawRect(dimensions, width, color) {

        var requiredProperties = ['x', 'y', 'w', 'h'];

        try {

            bs.helpers.validObject(dimensions, requiredProperties);

            var context = bs.constants.CANVAS.CONTEXT;
            context.beginPath();
            context.lineWidth = width || 1;
            context.strokeStyle = color || bs.constants.COLORS.BLACK;
            context.rect(dimensions.x, dimensions.y, dimensions.w, dimensions.h);
            context.stroke();

        } catch (exception) {

            bs.helpers.handleException(exception);

        }

    }

})();