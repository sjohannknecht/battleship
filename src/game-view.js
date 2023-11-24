import messageBroker from "./message-broker";


export default function gameView() {
    // cache DOM nodes
    const announcement = document.querySelector(".announcement");
    const players = document.querySelectorAll(".player");
    const boards = document.querySelectorAll(".board");


    // subscribe to messageBroker
    messageBroker.subscribe("model-initialized", initialize);

    // delegate DOM events to messageBroker


    function initialize(model) {
        _renderPlayers(model.players);
        _renderShips(model.gameboards[0].board); // render ships only for human player
        _initializeBoard(model.gameboards[1].board); // render clickable board only for computer
    }



    function _renderShips(board) {
       board.forEach((row, rowIndex) => {
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const tile = board[rowIndex][colIndex];
                if (tile && tile.ship && tile.shipIndex === 0) {
                    _placeShip({x: colIndex, y: rowIndex}, tile.ship.length, tile.direction);
                }
            }
        })
    }

    function _placeShip(startLocation, length, direction) {
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
                button.classList.add("tile-button")
                button.setAttribute("id", `button-${rowIndex}-${colIndex}`)
                button.setAttribute("style", `grid-area: ${rowIndex + 1} / ${colIndex + 1}`)
                boards[1].appendChild(button);
            }
        })
    }

    function _renderPlayers(playerModels) {
        players.forEach((node, index) => {
            node.textContent = playerModels[index].name;
        })
    }
}