export default class Room {
    private roomName: string;
    private isConnected: boolean;

    constructor(roomName: string) {
        this.roomName = roomName;
        this.isConnected = false;
    }

    public connect(): void {
        if (this.isConnected) {
            return;
        }
    }

    public create(): void {

    }

    public disconnect(): void {
        if (!this.isConnected) {
            return;
        }
    }

    public static getRoomNames(): Array<string> {
        return [];
    }
}
