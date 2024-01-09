import gameView from "./view/game-view";
import gameFactory from "./model/game-factory";
import "./index.css";

// eslint-disable-next-line no-unused-vars
const app = {
  view: gameView(),
  game: gameFactory("Player", "Computer").initializeRandom(),
};
