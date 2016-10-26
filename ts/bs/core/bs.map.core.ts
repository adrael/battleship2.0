/// <reference path="../../namespaces.ts" />

namespace bs {

    export namespace core {

        let _self: any = null;
        let _ships: Array<bs.ships.AbstractShip> = [];

        export class Map extends bs.core.Core {

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

            public getShipsAt = (x: number, y: number) : Array<bs.ships.AbstractShip> => {
                let _result = [];
                let _orientation = this.constants.get('orientation');

                bs.utils.forEach(_ships, (_ship: bs.ships.AbstractShip) => {

                    let startX = _ship.location.x,
                        endX = (_ship.orientation === _orientation.horizontal ? _ship.location.x + _ship.length - 1 : _ship.location.x),
                        startY = _ship.location.y,
                        endY = (_ship.orientation === _orientation.horizontal ? _ship.location.y : _ship.location.y + _ship.length - 1);

                    if (x >= startX && x <= endX && y >= startY && y <= endY) {
                        _result.push(_ship);
                    }

                });

                return _result;
            };

            public addShip = (ship: bs.ships.AbstractShip) : this => {
                if (!this.isShipLocationValid(ship)) {
                    throw new bs.exceptions.BSInvalidCoordinatesException(ship.location.x, ship.location.y);
                }

                if (!bs.utils.isString(ship.UUID) || !ship.UUID.length) {
                    throw new bs.exceptions.BSMissingPropertyException('UUID');
                }

                let _validShip = true;
                bs.utils.forEach(_ships, (_ship: bs.ships.AbstractShip) => {
                    if (_validShip && _ship.UUID === ship.UUID) {
                        _validShip = false;
                    }
                });

                if (_validShip) {
                    _ships.push(ship);
                }

                return this;
            };

            public isShipLocationValid = (ship: bs.ships.AbstractShip) : boolean => {
                return this.locationIsWithinMap(ship) && !this.overlappingOtherShips(ship);
            };

            public reset = () : this => {
                _ships = [];
                return this;
            };

            public getFreeCoordinates = (orientation: string, length: number) : Object => {
                let _line = this.constants.get('line'),
                    _ship = {
                        name: 'FAKE',
                        length: length,
                        orientation: orientation,
                        location: <any>{}
                    };

                do {
                    _ship.location.x = 1 + Math.abs(Math.floor(Math.random() * (_line.count)) - length);
                    _ship.location.y = 1 + Math.abs(Math.floor(Math.random() * (_line.count)) - length);

                } while(!this.isShipLocationValid(<bs.ships.AbstractShip>_ship));

                return { x: _ship.location.x, y: _ship.location.y };
            };

            public locationIsWithinMap = (ship: bs.ships.AbstractShip) : boolean => {
                let _orientation = this.constants.get('orientation'),
                    max = this.constants.get('line').count,
                    vLength = (ship.orientation === _orientation.vertical) ? ship.length : 1,
                    hLength = (ship.orientation === _orientation.horizontal) ? ship.length : 1;

                return ship.location.x >= 1 && ship.location.x + hLength - 1 < max &&
                    ship.location.y >= 1 && ship.location.y + vLength - 1 < max;
            };

            public overlappingOtherShips = (ship: bs.ships.AbstractShip) : boolean => {
                let cursor = <any>{},
                    isHorizontal = (ship.orientation === this.constants.get('orientation').horizontal);

                try {

                    for (let index = 0; index < ship.length; ++index) {
                        cursor.x = ship.location.x + (isHorizontal ? index : 0);
                        cursor.y = ship.location.y + (isHorizontal ? 0 : index);
                        _validFreeCoordinates(cursor.x, cursor.y, ship);
                    }

                } catch (exception) {
                    return true;
                }

                return false;
            };

        }

        /**********************************************************************************/
        /*                                                                                */
        /*                               PRIVATE MEMBERS                                  */
        /*                                                                                */
        /**********************************************************************************/

        function _validFreeCoordinates(x: number, y: number, ship: bs.ships.AbstractShip) : boolean {

            let _line = _self.constants.get('line');
            if (x < 1 || x > _line.count || y < 1 || y > _line.count) {
                throw new bs.exceptions.BSInvalidCoordinatesException(x, y)
            }

            let _ships = _self.getShipsAt(x, y);
            if (!_ships.length || (_ships.length === 1 && _ships[0].UUID === ship.UUID)) {
                return true;
            }

            throw new bs.exceptions.BSInvalidCoordinatesException(x, y);

        }

    }

}
