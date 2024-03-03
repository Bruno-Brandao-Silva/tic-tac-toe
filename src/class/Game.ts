export default class Game {
    private board: string[][];
    private turn: number | undefined;
    private users: { userToken: string, userChar: string }[];
    private started: boolean;

    constructor() {
        this.board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
        this.started = false;
        this.users = [];
    }

    public addUser(username: string): void {
        if (this.users.length < 2) {
            this.users.push({
                userToken: username,
                userChar: this.users.length === 0 ? Math.random() < 0.5 ? 'X' : 'O' : this.users[0].userChar === 'X' ? 'O' : 'X'
            });
        }
    }

    public getUsers() {
        return this.users;
    }

    public startGame(): boolean {
        if (this.users.length === 2 && !this.started) {
            this.started = true;
            this.turn = Math.random() < 0.5 ? 0 : 1;
            return true;
        }
        return false;
    }

    public play(x: number, y: number, token: string): boolean {
        if (!this.started || this.board[x][y] !== ' ' || this.users[this.turn!]?.userToken !== token) return false;
        this.board[x][y] = this.users[this.turn!]?.userChar;
        this.turn = this.turn === 0 ? 1 : 0;
        return true;
    }

    public getGame(): string[][] {
        return this.board;
    }

    public getTurn(): string {
        return this.users[this.turn!]?.userToken;
    }

    public isStarted(): boolean {
        return this.started;
    }

    public getWinner(): string | null {
        const char = this.getWinnerChar();
        if (char) {
            return this.users.find(user => user.userChar === char)?.userToken!;
        }
        if (this.isDraw()) {
            return 'draw';
        }
        return null;
    }

    public getWinnerChar(): string | null {
        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] !== ' ' && this.board[i][0] === this.board[i][1] && this.board[i][0] === this.board[i][2]) {
                return this.board[i][0];
            }
        }
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] !== ' ' && this.board[0][i] === this.board[1][i] && this.board[0][i] === this.board[2][i]) {
                return this.board[0][i];
            }
        }
        if (this.board[0][0] !== ' ' && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
            return this.board[0][0];
        }
        if (this.board[0][2] !== ' ' && this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
            return this.board[0][2];
        }
        return null;
    }

    public isDraw(): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === ' ') {
                    return false;
                }
            }
        }
        return true;
    }

}