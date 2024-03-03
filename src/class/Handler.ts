import Game from "./Game";
import Player from "./Player";
import { randomUUID } from "crypto";
export default class Handler {
    private games: { [id: string]: Game } = {};
    private players: { [indentifyToken: string]: Player } = {};

    private newIdentifyToken(): string {
        let indentifyToken: string;
        do {
            indentifyToken = randomUUID();
        } while (this.players[indentifyToken]);
        return indentifyToken;
    }

    public getNewGame(): string {
        let id: string;
        do {
            id = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        } while (this.games[id]);
        this.games[id] = new Game();
        return id;
    }

    public isValidGame(id: string): boolean {
        return !!this.games[id];
    }

    public addPlayer(socketId: string, gameId: string): string | undefined {
        if (!this.games[gameId])
            return;
        const indentifyToken = this.newIdentifyToken();
        this.players[indentifyToken] = new Player(socketId);
        this.games[gameId].addUser(indentifyToken);
        return indentifyToken;
    }

    public reconnectPlayer(socketId: string, indentifyToken: string): boolean {
        if (!this.players[indentifyToken])
            return false;
        this.players[indentifyToken].setSocketId(socketId);
        return true;
    }

    public startGame(gameId: string): boolean {
        if (!this.games[gameId])
            return false;
        return this.games[gameId].startGame();
    }

    public play(gameId: string, x: number, y: number, indentifyToken: string): boolean {
        if (!this.games[gameId] || !this.players[indentifyToken])
            return false;
        return this.games[gameId].play(x, y, indentifyToken);
    }

    public getPlayerByGame(gameId: string): string[] {
        let response: string[] = [];
        if (!this.games[gameId])
            return [];

        this.games[gameId].getUsers().forEach((users) => response.push(this.players[users.userToken].getSocketId()));
        return response;
    }

    public getGameUpdate(gameId: string) {
        if (!this.games[gameId]) return;
        return {
            started: this.games[gameId].isStarted(),
            game: this.games[gameId].getGame(),
            turn: this.games[gameId].getTurn(),
            winner: this.games[gameId].getWinner()
        };
    }
}