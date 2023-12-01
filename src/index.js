import gameView from "./view/game-view";
import gameFactory from "./model/game-factory";
import "./index.css";


const app = {
    view: gameView(),
    game: gameFactory("Player", "Computer").initializeRandom(),
};