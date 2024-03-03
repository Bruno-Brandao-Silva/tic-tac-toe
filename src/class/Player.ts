export default class Player {
    private socketId: string;

    constructor(socketId: string) {
        this.socketId = socketId;
    }

    public setSocketId(socketId: string): void {
        this.socketId = socketId;
    }

    public getSocketId(): string {
        return this.socketId;
    }
}