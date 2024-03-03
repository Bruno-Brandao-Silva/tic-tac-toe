import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import Handler from './class/Handler';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const handler = new Handler();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/new-game', (req, res) => {
    res.redirect(`/game/${handler.getNewGame()}`);
});

app.get('/game/:id', (req, res) => {
    const id: string = req.params.id!.toString();

    if (!id || handler.isValidGame(id)) {
        res.sendFile(path.join(__dirname, 'private', 'game', 'index.html'));
        return;
    } else {
        res.redirect(`/404`);
        return;
    }
});

io.on('connection', (socket) => {
    socket.on('join', (gameId: string) => {
        const token = handler.addPlayer(socket.id, gameId);
        if (!token) return;
        socket.emit('token', token);
        socket.join(gameId);
        if (handler.startGame(gameId)) {
            io.to(gameId).emit('started', handler.getGameUpdate(gameId));
        }
    });

    socket.on('rejoin', (gameId: string, indentifyToken: string) => {
        if (handler.reconnectPlayer(socket.id, indentifyToken)) {
            socket.join(gameId);
            socket.emit('rejoined', handler.getGameUpdate(gameId));
        }
    });

    socket.on('play', (gameId, x, y, token) => {
        if (handler.play(gameId, x, y, token)) {
            io.to(gameId).emit('played', handler.getGameUpdate(gameId));
        }
    });

    socket.on('disconnect', () => {
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});