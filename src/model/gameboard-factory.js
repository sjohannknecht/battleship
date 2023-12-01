import shipFactory from "./ship-factory";
import {getRandomInt} from "../util";
import messageBroker from "../message-broker";

const gameboardProto = {
    board: [[]],
    ships: [],

    /**
     * Returns true if the location is out of bounds of the board, else false.
     * @param location An object with x and y coordinates
     * @returns {boolean} Returns true if the location is out of bounds of the board, else false.
     * @private
     */
    _isLocationOutOfBounds(location) {
        const {x, y} = location;
        return x >= 10 || x < 0 || y >= 10 || y < 0;
    },

    /**
     * Checks if the ship to be placed would not be out of bounds and would not interfere with an already existing ship.
     * @param startLocation An object with x and y coordinates of the start position of the ship
     * @param length The length of the ship
     * @param direction A string indicating whether the ship is placed 'horizontal' or 'vertical'
     * @returns {boolean} True if it can be placed, else false.
     */
    _canShipBePlaced(startLocation, length, direction) {
        const {x, y} = startLocation;
        const x_end = direction === "horizontal" ? x + length - 1 : x;
        const y_end = direction === "vertical" ? y + length - 1 : y;
        if (this._isLocationOutOfBounds(startLocation) || this._isLocationOutOfBounds({x: x_end, y: y_end})) {
            return false;
        }
        for (let row = y; row <= y_end; row++) {
            for (let col = x; col <= x_end; col++) {
                if (this.board[row][col] !== undefined && this.board[row][col] !== "miss") {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * Checks if all ships of the gameboard sunk.
     * @returns {boolean} True if all ships are sunk, else false.
     */
    areAllShipsSunk() {
        if (this.ships.length === 0) {
            throw new Error("No ships were placed yet");
        }
        return this.ships.every((ship) => ship.isSunk());
    },

    /**
     * Creates a ship and stores an object containing a reference to it in all tiles that the ship occupies. The object
     * also stores the shipIndex.
     * @param startLocation An object with x and y coordinates of the start position of the ship
     * @param length The length of the ship
     * @param direction A string indicating whether the ship is placed 'horizontal' or 'vertical'
     */
    placeShip(startLocation, length, direction) {
        if (this._canShipBePlaced(startLocation, length, direction)) {
            const {x, y} = startLocation;
            const x_end = direction === "horizontal" ? x + length - 1 : x;
            const y_end = direction === "vertical" ? y + length - 1 : y;
            const ship = shipFactory(length);
            let shipIndexCounter = 0;
            for (let row = y; row <= y_end; row++) {
                for (let col = x; col <= x_end; col++) {
                    this.board[row][col] = {
                        ship: ship,
                        shipIndex: shipIndexCounter++,
                        direction,
                    };
                }
            }
            this.ships.push(ship); // store the ship in this.ships, too, for easy access for the _areAllShipsSunk-Method
        } else {
            throw new Error("Ship cannot be placed here.")
        }
    },

    /**
     * Registers an attack at the given location of the gameboard. Either the hit-Method of the ship will be called or
     * the location is marked as 'miss'
     * @param  location An object with x and y coordinates where to hit
     * @returns {boolean} True if a ship was hit, false if not.
     */
    receiveAttack(location) {
        if (this._isLocationOutOfBounds(location)) {
            throw new Error("Location is out of bounds of the board.")
        }
        const {x, y} = location;
        if (this.board[y][x] !== undefined && this.board[y][x] !== "miss") {
            this.board[y][x].ship.hit(this.board[y][x].shipIndex);
            if (this.board[y][x].ship.isSunk()) {
                messageBroker.publish("model:sunk", {boardId: this.id, ship: this.board[y][x].ship, location: this.getShipStartLocation(this.board[y][x].ship), direction: this.board[y][x].direction});
            }
            return true;
        } else {
            this.board[y][x] = "miss";
            return false;
        }
    },

    getShipStartLocation(ship) {
        const location = {};
        this.board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                if (ship === col.ship && col.shipIndex === 0) {
                    location.x = colIndex;
                    location.y = rowIndex;
                }
            })
        })
        return location;
    },

    /**
     * Places 5 ships of different lengths on the board randomly. If a ship can't be placed in a location, the inner
     * function recursively tries again until the ship can be placed.
     */
    random() {
        const shipLengths = [2, 3, 3, 4, 5];
        function placeShipRandomly(length) {
            const randomDirection = Math.random() < 0.5 ? "horizontal" : "vertical";
            try {
                this.placeShip({x: getRandomInt(10), y: getRandomInt(10)}, length, randomDirection);
            } catch(e) {
                placeShipRandomly.call(this, length);
            }
        }
        shipLengths.forEach((shipLength) => {
            placeShipRandomly.call(this, shipLength);
        })
    }
}

/**
 * Creates and returns a new gameboard. For playing the game two gameboards are needed - one for each player. The
 * methods are defined on the prototype.
 * @returns {{placeShip(*, *, *): void, ships: *[], receiveAttack(*): void, _canShipBePlaced(*, *, *): boolean, areAllShipsSunk(): boolean, _isLocationOutOfBounds(*): boolean, board: *[][]} & {ships: *[], board: *[]}}
 */
export default function gameboardFactory() {
    const board = [];
    for (let row = 0; row < 10; row++) {
        board.push(new Array(10));
    }
    return Object.assign(Object.create(gameboardProto), {
        board: board,
        ships: [],
        id: crypto.randomUUID(),
    });
}