import messageBroker from "../message-broker";


export default function gameView() {
    // cache DOM nodes
    const announcement = document.querySelector(".announcement");
    const playerNames = document.querySelectorAll(".player-name");
    const boards = document.querySelectorAll(".board");


    // subscribe to messageBroker
    messageBroker.subscribe("model:initialized", initialize);
    messageBroker.subscribe("model:miss", renderMiss)
    messageBroker.subscribe("model:hit", renderHit)
    messageBroker.subscribe("model:sunk", renderSunk)


    // register DOM event listeners and delegate to messageBroker
    boards[1].addEventListener("click", delegateAttack);

    function initialize(model) {
        _initializePlayerNames(model.players);
        _renderShips(model.gameboards[0].board); // render ships only for human player
        _initializeBoard(model.gameboards[1].board); // render clickable board only for computer
    }

    function _renderShips(board) {
       board.forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const tile = board[rowIndex][colIndex];
                if (tile && tile.ship && tile.shipIndex === 0) {
                    placeShip(board, {x: colIndex, y: rowIndex}, tile.ship.length, tile.direction);
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
        boards[0].appendChild(ship);
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

    function delegateAttack(event) {
        const location = {
            x: event.target.dataset.x,
            y: event.target.dataset.y,
        }
        messageBroker.publish("view:attack", location);
    }

    function _initializePlayerNames(playerModels) {
        playerNames.forEach((node, index) => {
            node.textContent = playerModels[index].name;
        })
    }

    function renderMiss(data) {
        const {boardId, location} = data;
        const board = boards.querySelector(`[id=${boardId}]`);

    }

    function renderHit(data) {
        const {playerId, location} = data;
    }

    function renderSunk(data) {
        const {playerId, location} = data;
    }
}