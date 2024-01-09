import gameboardFactory from "../src/model/gameboard-factory";

describe("gameboard tests", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = gameboardFactory();
  });

  test("If no ships are placed yet, then no ships are sunk", () => {
    expect(() => gameboard.areAllShipsSunk()).toThrow;
  });

  test("The board throws an error if it receives an attack outside of bounds of the board.", () => {
    expect(() => gameboard.receiveAttack({ x: 9, y: 10 })).toThrow();
  });

  test("Ship can't be placed so it would be horizontally out of bounds. Throws error", () => {
    expect(() =>
      gameboard.placeShip({ x: 9, y: 4 }, 2, "horizontal"),
    ).toThrow();
  });

  test("Ship can't be placed so it would be vertically out of bounds. Throws error", () => {
    expect(() => gameboard.placeShip({ x: 3, y: 9 }, 2, "vertical")).toThrow();
  });

  test("Test if ship is in fact placed in correct location", () => {
    gameboard.placeShip({ x: 0, y: 0 }, 2, "horizontal");
    expect(
      gameboard.board[0][0] !== "miss" && gameboard.board[0][0] !== undefined,
    ).toBe(true);
  });

  test("A ship can't be placed on top of another", () => {
    gameboard.placeShip({ x: 0, y: 0 }, 2, "horizontal");
    expect(() =>
      gameboard.placeShip({ x: 0, y: 0 }, 2, "horizontal"),
    ).toThrow();
  });

  test("A ship can't be placed if it would intersect with another ship", () => {
    gameboard.placeShip({ x: 0, y: 2 }, 2, "horizontal");
    expect(() => gameboard.placeShip({ x: 0, y: 0 }, 3, "vertical")).toThrow();
  });

  test("After hitting a ship of length 2 once, not all ships are sunk.", () => {
    gameboard.placeShip({ x: 0, y: 0 }, 2, "horizontal");
    gameboard.receiveAttack({ x: 0, y: 0 });
    expect(gameboard.areAllShipsSunk()).toBe(false);
  });

  test("After placing one ship of length 2 and hitting it at both locations, all ships are sunk.", () => {
    gameboard.placeShip({ x: 0, y: 0 }, 2, "horizontal");
    gameboard.receiveAttack({ x: 0, y: 0 });
    gameboard.receiveAttack({ x: 1, y: 0 });
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });

  test("Receiving an attack outside ouf bounds of array trows error.", () => {
    expect(() => gameboard.receiveAttack({ x: -1, y: 4 })).toThrow();
  });

  test("Placing a ship of length 4 on the board will make the ship accessible in the ships-array", () => {
    gameboard.placeShip({ x: 0, y: 0 }, 4, "horizontal");
    expect(gameboard.ships[0].length).toBe(4);
  });

  test("Using the random method results in 5 ships being present on the board.", () => {
    gameboard.random();
    expect(gameboard.ships.length).toBe(5);
  });
});
