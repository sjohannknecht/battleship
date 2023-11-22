const playerProto = {
    name: "default",
    isComputer: false,
    attack(location) {
        this.opponentsGameboard.receiveAttack(location);
    }
};

/**
 * Creates and returns a player object.
 * @param isComputer If true, then the player is a computer player.
 * @param ownGameboard The gameboard of the created player;
 * @param opponentsGameboard The gameboard of the opponent.
 * @returns {{isComputer: boolean, attack(*): void, name: string} & {opponentsGameboard, isComputer, ownGameboard}}
 */
export default function playerFactory(isComputer, ownGameboard, opponentsGameboard) {
    return Object.assign(Object.create(playerProto), {
        isComputer,
        ownGameboard,
        opponentsGameboard
    })
}
