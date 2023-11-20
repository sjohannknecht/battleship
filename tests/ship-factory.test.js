import shipFactory from "../src/ship-factory";

describe("ship factory tests", () => {
    test("ship has correct length of 3", () => {
        const ship = shipFactory(3);
        expect(ship.length).toBe(3);
    })

    test("ship has correct length of 4", () => {
        const ship = shipFactory(4);
        expect(ship.length).toBe(4);
    })

    test("ship of length 2 is not sunk after one hit", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        expect(ship.isSunk()).toBe(false);
    })

    test("hitting a ship outside its length throws error", () => {
        const ship = shipFactory(10);
        expect(() => ship.hit(10)).toThrow();
    })

    test("ship of length 2 with 2 hits is sunk", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        ship.hit(1);
        expect(ship.isSunk()).toBe(true);
    })

    test("hits array has elements of undefined where it is not hit", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        expect(ship.hits[0]).toBe(true);
        expect(ship.hits[1]).toBeUndefined();
    })
})