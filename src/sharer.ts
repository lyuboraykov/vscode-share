import Room from './room';

export default class Sharer {
    public static share(roomName: string) {
        const room = new Room(roomName);
        room.create();
        room.connect();
    }

    public static connectToRoom(roomName: string) {
        const room = new Room(roomName);
        room.connect();
    }
}
