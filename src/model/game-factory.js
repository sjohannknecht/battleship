import gameboardFactory from "./gameboard-factory";
import playerFactory from "./player-factory";
import {getRandomInt} from "../util";
import messageBroker from "../message-broker";

const gameProto = {
    activePlayer: undefined,
    gameStates: ["preparation", "playing", "finished"],
    gameStateIndex: 0,
    _incrementGameStateIndex()  {
        this.gameStateIndex++;
    },
    _switchActivePlayer() {
        this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
        messageBroker.publish("model:active-player", this.activePlayer);
        if (this.activePlayer.isComputer) {
            messageBroker.publish("model:attack", null);
        }
    },

    computersTurn() {

    },

    executeAttackPlayer(location) {
        if (!this.activePlayer.isComputer) {
            const hit = this.activePlayer.attack(location);
            const messageData = {boardId: this.activePlayer.opponentsGameboard.id, location};
            const message = hit ? "model:hit" : "model:miss";
            messageBroker.publish(message, messageData)
            this._switchActivePlayer();
        }
    },

    executeAttackComputer() {
        if (this.activePlayer.isComputer) {
            setTimeout(() => {
                const location = {x: getRandomInt(10), y: getRandomInt(10)}
                const hit = this.activePlayer.attack(location);
                const messageData = {boardId: this.activePlayer.opponentsGameboard.id, location};
                const message = hit ? "model:hit" : "model:miss";
                messageBroker.publish(message, messageData)
                this._switchActivePlayer()
            }, 1000 - getRandomInt(500))
        }
    },

    initializeRandom() {
        this.gameboards.forEach(gameboard => gameboard.random());
        messageBroker.subscribe("view:attack", this.executeAttackPlayer.bind(this));
        messageBroker.subscribe("model:attack", this.executeAttackComputer.bind(this));
        messageBroker.publish("model:initialized", this);
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