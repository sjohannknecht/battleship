import gameboardFactory from "../src/model/gameboard-factory";
import playerFactory from "../src/model/player-factory";

describe("player tests", () => {
  let gameboardHumanPlayer,
    gameboardComputerPlayer,
    humanPlayer,
    computerPlayer;

  beforeEach(() => {
    gameboardHumanPlayer = gameboardFactory();
    gameboardComputerPlayer = gameboardFactory();
    humanPlayer = playerFactory(
      false,
      gameboardHumanPlayer,
      gameboardComputerPlayer,
    );
    computerPlayer = playerFactory(
      true,
      gameboardComputerPlayer,
      gameboardHumanPlayer,
    );
  });

  test("Players each have their own gameboard", () => {
    expect(humanPlayer.ownGameboard !== computerPlayer.ownGameboard).toBe(true);
  });

  test("A Players ownGameboard is the opponents opponentsGameboard", () => {
    expect(humanPlayer.ownGameboard === computerPlayer.opponentsGameboard).toBe(
      true,
    );
  });

  test("A Players opponentsGameboard is the opponents ownGameboard", () => {
    expect(humanPlayer.ownGameboard === computerPlayer.opponentsGameboard).toBe(
      true,
    );
  });
});
