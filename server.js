const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const http = require('http');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const supabaseUrl = 'https://zdilnbfvvqbqckichnsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkaWxuYmZ2dnFicWNraWNobnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwOTk3NjQsImV4cCI6MjAzMjY3NTc2NH0.mcOLAzGDLBV-ZUxXEBKdU1bV7q0c5AhgWQnKNYDAKFs';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static(path.join(__dirname, 'public')));

let clients = {};
let playerChoices = {};

wss.on('connection', (ws) => {
    const id = Date.now().toString();
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

async function saveResult(id1, choice1, result1, id2, choice2, result2) {
    const { error } = await supabase
        .from('results')
        .insert([
            {
                user_id: id1,
                choice1,
                result1,
                choice2,
                result2,
            },
        ]);

    if (error) {
        console.error('Error saving result:', error.message);
    } else {
        console.log('Result saved successfully');
    }
}

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

        saveResult(id1, choice1, result1, id2, choice2, result2);

        delete playerChoices[id1];
        delete playerChoices[id2];
    }
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
