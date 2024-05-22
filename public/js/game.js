const ws = new WebSocket('ws://localhost:3000');
let playerId;

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.type === 'id') {
        playerId = data.id;
        
    } else if (data.type === 'result') {
        document.getElementById('status').innerText = 'Juego completado';
        document.getElementById('opponentChoice').innerText = `El oponente eligió: ${data.opponentChoice}`;
        document.getElementById('outcome').innerText = `Resultado: ${data.result === 'win' ? 'Ganaste' : data.result === 'lose' ? 'Perdiste' : 'Empate'}`;
    }
};

function makeChoice(choice) {
    ws.send(JSON.stringify({ type: 'choice', id: playerId, choice }));
    document.getElementById('status').innerText = 'Esperando al oponente...';
}

