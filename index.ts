import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface Room {
    users: {
        id: string;
        username?: string;
    }[];
    game?: string[][];
    turn?: string;
}

const rooms: { [key: string]: Room } = {};

app.use(express.static(__dirname + '/public'));

app.get('/new-room', (req, res) => {
    let roomId: string;
    do {
        roomId = Math.random().toString().substring(2, 6);
    } while (rooms[roomId]);
    rooms[roomId] = { users: [] };
    res.redirect(`/room/${roomId}`);
});

app.get('/room/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    if (!rooms[roomId]) {
        res.redirect('/404');
    } else {
        const script = `
        <script>
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('roomId', '${roomId}');
                console.log('ID salvo com sucesso:', '${roomId}');
                window.location.href = '/room';
            } else {
                console.log('Navegador não suporta localStorage.');
            }
        </script>
    `;
        // create a new room in socket.io
        res.send(script);
    }
});

const isValidMove = (game: string[][], x: number, y: number): boolean => {
    if (x < 0 || x > 2 || y < 0 || y > 2) {
        return false;
    }
    return game[x][y] === ' ';
};

const checkWinner = (game: string[][]): string | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (game[i][0] !== ' ' && game[i][0] === game[i][1] && game[i][0] === game[i][2]) {
            return game[i][0];
        }
    }
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (game[0][i] !== ' ' && game[0][i] === game[1][i] && game[0][i] === game[2][i]) {
            return game[0][i];
        }
    }
    // Check diagonals
    if (game[0][0] !== ' ' && game[0][0] === game[1][1] && game[0][0] === game[2][2]) {
        return game[0][0];
    }
    if (game[0][2] !== ' ' && game[0][2] === game[1][1] && game[0][2] === game[2][0]) {
        return game[0][2];
    }
    return null;
};

const isDraw = (game: string[][]): boolean => {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (game[i][j] === ' ') {
                return false;
            }
        }
    }
    return true;
};

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join room', (roomId: string) => {
        if (!rooms[roomId]) {
            console.log('Room does not exist');
            socket.emit('room not found');
            return;
        }
        if (rooms[roomId].users.length >= 2) {
            console.log('Room is full');
            socket.emit('room is full');
            return;
        }

        rooms[roomId].users.push({ id: socket.id });
        socket.join(roomId);

        console.log('User joined room:', roomId);
        if (rooms[roomId].users.length === 2) {
            const rng = Math.random() > 0.5;
            rooms[roomId].users[0].username = rng ? 'X' : 'O';
            rooms[roomId].users[1].username = !rng ? 'X' : 'O';
            rooms[roomId].game = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
            rooms[roomId].turn = rooms[roomId].users[Math.floor(Math.random() * 2)].id;
            io.to(roomId).emit('start game', rooms[roomId].game, rooms[roomId].turn);
        }
    });
    socket.on('play', (roomId, x, y) => {
        console.log('User played:', roomId, x, y);
        if (rooms[roomId] && rooms[roomId].game && rooms[roomId].users.length === 2) {
            console.log('Game is ready');
            if (rooms[roomId].turn === socket.id) {
                console.log('It is your turn');
                if (isValidMove(rooms[roomId].game!, x, y)) {
                    console.log('Valid move');
                    rooms[roomId].game![x][y] = rooms[roomId].users.find(user => user.id === socket.id)!.username!;
                    rooms[roomId].turn = rooms[roomId].users.find(user => user.id !== socket.id)!.id;
                    console.log('Emitting update game', rooms[roomId].game, rooms[roomId].turn);
                    io.to(roomId).emit('update game', rooms[roomId].game, rooms[roomId].turn);

                    const winner = checkWinner(rooms[roomId].game!);
                    if (winner) {
                        io.to(roomId).emit('game over', winner);
                    } else if (isDraw(rooms[roomId].game!)) {
                        io.to(roomId).emit('game over', 'draw');
                    }
                } else {
                    console.log('Invalid move');
                    socket.emit('invalid move', 'Invalid move. Please try again.');
                }
            } else {
                console.log('It is not your turn');
                socket.emit('invalid move', 'It is not your turn.');
            }
        } else {
            console.log('Game is not ready or room does not exist');
            socket.emit('invalid move', 'Game is not ready or room does not exist.');
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});