(function () {

    'use strict';

    /**********************************************************************************/
    /*                                                                                */
    /*                                     SETUP                                      */
    /*                                                                                */
    /**********************************************************************************/

    window.bs = (window.bs || {});
    window.bs.exceptions = (window.bs.exceptions || {});

    window.bs.exceptions.BSFactoryException = BSFactoryException;

    /**********************************************************************************/
    /*                                                                                */
    /*                                  CONSTRUCTOR                                   */
    /*                                                                                */
    /**********************************************************************************/

    /**
     * @name BSFactoryException
     * @kind Exception
     *
     * @description
     * The factory exception to inherit from.
     */
    function BSFactoryException() {
        this.name = 'BSFactoryException';
        this.stack = (new Error()).stack;
        this.toString = function () { return this.name + ': ' + this.message; };
        this.message = 'An error occured.';
    }

    BSFactoryException.prototype = Object.create(Error.prototype);
    BSFactoryException.prototype.constructor = BSFactoryException;

    /**********************************************************************************/
    /*                                                                                */
    /*                                PUBLIC MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



    /**********************************************************************************/
    /*                                                                                */
    /*                               PRIVATE MEMBERS                                  */
    /*                                                                                */
    /**********************************************************************************/



})();
