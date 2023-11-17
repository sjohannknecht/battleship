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

export default function shipFactory(length) {
    const ship =  Object.create(shipProto);
    ship._hits = [...new Array(length)]; // to get an array full of values of undefined with the respective length
    return ship;
}

