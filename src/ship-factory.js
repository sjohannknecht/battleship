const shipProto = {
    _hits: [],
    hit(index) {
        if (index >= this._hits.length) {
            throw new Error("Index out of bounds of ship length")
        }
        this._hits[index] = true;
    },
    isSunk() {
        return this._hits.every((value) => value === true);
    },
    get length() {
        return this._hits.length;
    },
    get hits() {
        return this._hits;
    }
}

/**
 * Creates and returns a new ship object with the given length. The methods are defined on the prototype shipProto. The
 * length of the ship is saved indirectly by the length of the _hits array.
 * @param length
 * @returns {{readonly hits: shipProto._hits|[], isSunk(): *|this is T[], hit(*): void, _hits: *[], readonly length: shipProto._hits.length|number}}
 */
export default function shipFactory(length) {
    const ship =  Object.create(shipProto);
    ship._hits = [...new Array(length)]; // to get an array full of values of undefined with the respective length
    return ship;
}

