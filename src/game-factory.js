import gameboardFactory from "./gameboard-factory";
import playerFactory from "./player-factory";
import {getRandomInt} from "./util";
import messageBroker from "./message-broker";

const gameProto = {
    activePlayer: undefined,
    gameStates: ["preparation", "playing", "finished"],
    gameStateIndex: 0,
    _incrementGameStateIndex()  {
        this.gameStateIndex++;
    },
    _switchActivePlayer() {
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
    },
    executeMove(data) {
        const location = this.activePlayer.isComputer
            ? {x: getRandomInt(10), y: getRandomInt(10)}
            : {x: 0, y: 0};
        this.activePlayer.attack(location);
        this._switchActivePlayer();
    },
    initializeRandom() {
        this.gameboards.forEach(gameboard => gameboard.random());
        messageBroker.publish("model-initialized", this);
        return this;
    }
}


export default function gameFactory(playerName, computerName) {
    const gameboard1 = gameboardFactory();
    const gameboard2 = gameboardFactory();
    const player1 = playerFactory(false, gameboard1, gameboard2);
    player1.name = playerName;
    const player2 = playerFactory(true, gameboard2, gameboard1);
    player2.name = computerName;
    return Object.assign(Object.create(gameProto), {
        gameboards: [gameboard1, gameboard2],
        players: [player1, player2],
        activePlayer: player1,
    })
}