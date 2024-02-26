const roomId = localStorage.getItem('roomId');
if (!roomId) {
    window.location.href = '/';
}
const socket = io(
    "http://187.56.42.98:3000",
    {
        transports: ["websocket"],
    }
);
const roomCode = document.getElementById('roomId');
roomCode.innerText = roomId;
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 8;
const CELL_SIZE = 100;
const BOARD_SIZE = 3;

canvas.addEventListener('click', handleClick);

// Draw the tic-tac-toe board
function drawBoard(game) {
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
}

// Handle click events on the canvas
function handleClick(event) {
    console.log('click');
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);
    socket.emit('play', roomId, y, x);
}

function drawSymbol(x, y, symbol) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 3;

    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (symbol === 'X') {
        ctx.fillText(symbol, centerX, centerY);
    } else if (symbol === 'O') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

const gameHandler = (game, turn) => {
    console.log(game);
    console.log(turn);
    drawBoard(game);
    if (turn === socket.id) {
        canvas.addEventListener('click', handleClick);
    }
    else {
        canvas.removeEventListener('click', handleClick);
    }
}
socket.on('start game', gameHandler)
socket.on('update game', gameHandler);


socket.emit('join room', roomId);
socket.on('game over', (winner) => {
    alert(`Game over! ${winner} wins!`);
    window.location.href = '/';
});
socket.on('room is full', () => {
    alert('Room is full');
    window.location.href = '/';
});

socket.on('room not found', () => {
    alert('Room not found');
    window.location.href = '/';
});
