let token = localStorage.getItem('token');
const gameId = window.location.pathname.split('/').pop();
const socket = io(
    window.location.origin,
    {
        transports: ["websocket"],
    }
);
const roomCode = document.getElementById('roomId');
roomCode.innerText = gameId;
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 8;
const CELL_SIZE = 100;
const BOARD_SIZE = 3;
const messageH2 = document.getElementById('message');

canvas.addEventListener('click', handleClick);

// Draw the tic-tac-toe board
async function drawBoard(game) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw horizontal lines
    for (let i = 1; i < BOARD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
    }

    // Draw vertical lines
    for (let j = 1; j < BOARD_SIZE; j++) {
        ctx.beginPath();
        ctx.moveTo(j * CELL_SIZE, 0);
        ctx.lineTo(j * CELL_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (game[i][j] !== '') {
                drawSymbol(j, i, game[i][j]);
            }
        }
    }

    await new Promise(resolve => setTimeout(resolve, 200))
}

// Handle click events on the canvas
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);
    socket.emit('play', gameId, y, x, token);
}

function drawSymbol(x, y, symbol) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 3;

    ctx.font = '70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (symbol === 'X') {
        ctx.fillText(symbol, centerX, centerY+5);
    } else if (symbol === 'O') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

const gameHandler = async ({ started, game, turn, winner }) => {
    if (!started) {
        return;
    }
    await drawBoard(game);
    if (winner) {
        canvas.removeEventListener('click', handleClick);
        let winnerStr
        switch (winner) {
            case token:
                winnerStr = 'You win!';
                break;
            case 'draw':
                winnerStr = 'Draw!';
                break;
            default:
                winnerStr = 'You lose!';
        }
        messageH2.innerText = winnerStr + ' Redirecting to home page in 3 seconds...';
        for (let i = 2; i >= 0; i--) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            messageH2.innerText = winnerStr + ` Redirecting to home page in ${i} seconds...`;
        }
        window.location.href = '/';
        return;
    }
    if (turn == token) {
        messageH2.innerText = 'Your turn!';
        canvas.addEventListener('click', handleClick);
    }
    else {
        messageH2.innerText = "Opponent's turn...";
        canvas.removeEventListener('click', handleClick);
    }
}
socket.on('started', gameHandler)
socket.on('played', gameHandler);
socket.on('rejoined', gameHandler);
socket.on('token', tkn => {
    localStorage.setItem('token', tkn);
    token = tkn;
});

if (token) {
    socket.emit('rejoin', gameId, token);
} else {
    socket.emit('join', gameId);
}


drawBoard([['', '', ''], ['', '', ''], ['', '', '']])
messageH2.innerText = 'Waiting for another player to join...';
