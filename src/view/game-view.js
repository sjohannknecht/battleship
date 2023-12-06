import messageBroker from "../message-broker";


export default function gameView() {
    // cache DOM nodes
    const announcement = document.querySelector(".game__announcement");
    const playerNames = document.querySelectorAll(".player-name");
    const boards = document.querySelectorAll(".board");


    // subscribe to messageBroker
    messageBroker.subscribe("model:initialized", initialize);
    messageBroker.subscribe("model:miss", renderMiss)
    messageBroker.subscribe("model:hit", renderHit)
    messageBroker.subscribe("model:sunk", renderSunk)
    messageBroker.subscribe("model:active-player", renderActivePlayer)
    messageBroker.subscribe("model:game-finished", renderGameFinished)


    // register DOM event listeners and delegate to messageBroker
    boards[1].addEventListener("click", delegateAttack);

    function initialize(model) {
        announcement.textContent = "It's your turn!";
        _initializePlayerNames(model.players);
        _renderShips(model.gameboards[0].board); // render ships only for human player
        _initializeBoard(model.gameboards[1].board); // render clickable board only for computer
        _initializeBoards(model.gameboards);
    }

    function _renderShips(board) {
       board.forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const tile = board[rowIndex][colIndex];
                if (tile && tile.ship && tile.shipIndex === 0) {
                    placeShip(boards[0], {x: colIndex, y: rowIndex}, tile.ship.length, tile.direction);
                }
            }
        })
    }

    function placeShip(board, startLocation, length, direction) {
        const {x, y} = startLocation;
        const ship = document.createElement("div");
        ship.classList.add("ship")
        if (direction === "horizontal") {
            ship.classList.add("horizontal");
            ship.setAttribute("style", `grid-area: ${y + 1} / ${x + 1} / span 1 / span ${length}`)
        } else {
            ship.setAttribute("style", `grid-area: ${y + 1} / ${x + 1} / span ${length} / span 1`)

        }
        board.appendChild(ship);
    }

    function _initializeBoard(board) {
        board.forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const button= document.createElement("button");
                button.classList.add("board-button")
                button.setAttribute("id", `button-${rowIndex}-${colIndex}`)
                button.setAttribute("style", `grid-area: ${rowIndex + 1} / ${colIndex + 1}`)
                button.setAttribute("data-x", `${colIndex}`);
                button.setAttribute("data-y", `${rowIndex}`);
                boards[1].appendChild(button);
            }
        })
    }

    function _initializeBoards(boardModels) {
        boardModels.forEach((boardModel, index) => {
            boards[index].setAttribute("id", boardModel.id)
        })
    }

    function delegateAttack(event) {
        if (event.target.dataset.x === undefined) return;
        const location = {
            x: parseInt(event.target.dataset.x, 10),
            y: parseInt(event.target.dataset.y, 10),
        }
        messageBroker.publish("view:attack", location);
    }

    function _initializePlayerNames(playerModels) {
        playerNames.forEach((node, index) => {
            node.textContent = playerModels[index].name;
        })
    }

    function renderActivePlayer(activePlayer) {
        announcement.textContent = activePlayer.isComputer ? "It's the computers turn" : "It's your turn!";
    }

    function renderGameFinished(data) {
        announcement.textContent = `${data.player.name} won`;
    }

    function renderMiss(data) {
        const {boardId, location} = data;
        const board = [...boards].filter((b) => b.getAttribute("id") === boardId)[0];
        const miss = document.createElement("div");
        miss.classList.add("miss");
        miss.setAttribute("style", `grid-area: ${location.y + 1} / ${location.x + 1}`)
        board.appendChild(miss);
    }

    function renderHit(data) {
        const {boardId, location} = data;
        const board = [...boards].filter((b) => b.getAttribute("id") === boardId)[0];
        const hit = document.createElement("div");
        hit.classList.add("hit");
        hit.setAttribute("style", `grid-area: ${location.y + 1} / ${location.x + 1}`);
        board.appendChild(hit);
    }

    function renderSunk(data) {
        const {boardId, ship, location, direction} = data;
        const board = [...boards].filter((b) => b.getAttribute("id") === boardId)[0];
        placeShip(board, location, ship.length, direction);
    }
}