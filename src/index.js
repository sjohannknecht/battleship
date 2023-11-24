import gameView from "./game-view";
import gameFactory from "./game-factory";
import "./index.css";


const app = {
    view: gameView(),
    game: gameFactory("Player", "Computer").initializeRandom(),
};