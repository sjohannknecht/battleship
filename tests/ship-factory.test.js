import shipFactory from "../src/ship-factory";

describe("", () => {
    test("", () => {
        const ship = shipFactory(3);
        expect(ship.length).toBe(3);
    })

    test("", () => {
        const ship = shipFactory(4);
        expect(ship.length).toBe(4);
    })

    test("", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        expect(ship.isSunk()).toBe(false);
    })

    test("", () => {
        const ship = shipFactory(10);
        expect(() => ship.hit(10)).toThrow();
    })

    test("", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        ship.hit(1);
        expect(ship.isSunk()).toBe(true);
    })

    test("", () => {
        const ship = shipFactory(2);
        ship.hit(0);
        expect(ship.hits[0]).toBe(true);
        expect(ship.hits[1]).toBeUndefined();
    })
})