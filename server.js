const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));

let clients = {};
let playerChoices = {};

wss.on('connection', (ws) => {
    const id = Date.now();
    clients[id] = ws;
    ws.send(JSON.stringify({ type: 'id', id }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'choice') {
            playerChoices[data.id] = data.choice;
            checkGameResult();
        }
    });

    ws.on('close', () => {
        delete clients[id];
        delete playerChoices[id];
    });
});

function checkGameResult() {
    const playerIds = Object.keys(playerChoices);
    if (playerIds.length === 2) {
        const [id1, id2] = playerIds;
        const choice1 = playerChoices[id1];
        const choice2 = playerChoices[id2];

        let result1, result2;
        if (choice1 === choice2) {
            result1 = result2 = 'draw';
        } else if (
            (choice1 === 'Piedra' && choice2 === 'Tijera') ||
            (choice1 === 'Tijera' && choice2 === 'Papel') ||
            (choice1 === 'Papel' && choice2 === 'Piedra')
        ) {
            result1 = 'win';
            result2 = 'lose';
        } else {
            result1 = 'lose';
            result2 = 'win';
        }

        clients[id1].send(JSON.stringify({ type: 'result', result: result1, opponentChoice: choice2 }));
        clients[id2].send(JSON.stringify({ type: 'result', result: result2, opponentChoice: choice1 }));

        delete playerChoices[id1];
        delete playerChoices[id2];
    }
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
