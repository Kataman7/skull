export function getPlayerPositionsAndRotations(numPlayers, tableRadius) {
    const players = []

    for (let i = 0; i < numPlayers; i++) {
        const angle = (2 * Math.PI / numPlayers) * i
        const x = tableRadius * Math.cos(angle)
        const z = tableRadius * Math.sin(angle)
        const rotation = -angle - Math.PI / 2 // Rotation pour orienter vers le centre
        players.push({ position: [x, 0, z], rotation })
    }

    return players
}

export function generateSimpleId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function checkIfPlayerTurn(board, playerName) {
    return board &&
    board.currentTurn !== undefined &&
    board.players &&
    board.players.length > 0 &&
    board.players[board.currentTurn] &&
    board.players[board.currentTurn].name === playerName;
}

const env = import.meta.env.VITE_ENV || 'dev';

export function getAssetPath(path) {

    if (env === 'dev') {
        return 'public/' + path;
    }
    else {
        return '/' + path;
    }
    
}