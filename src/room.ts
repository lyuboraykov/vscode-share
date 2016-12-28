import {database} from 'firebase';

const VALUE_CHANGED_EVENT = 'value';

/**
 * Represents a room which is shared
 *
 * @export
 * @class Room
 */
export default class Room {
    private roomName: string;
    private roomPath: string;
    private isConnected: boolean;
    private onContentChangeCb: (content: string) => void;

    /**
     * Creates an instance of Room.
     *
     * @param {string} roomName - the name of the room to create
     * @param {(content: string) => void} onContentChange - this will be called every
     * time content changes
     *
     * @memberOf Room
     */
    constructor(roomName: string, onContentChange: (content: string) => void) {
        this.roomName = roomName;
        this.roomPath = `rooms/${this.roomName}`;
        this.isConnected = false;
        this.onContentChangeCb = onContentChange;
    }

    /**
     * Start listening for changes in a room
     *
     * Every time there's a change call onContentChange
     *
     * @returns {void}
     *
     * @memberOf Room
     */
    public connect(): void {
        if (this.isConnected) {
            return;
        }
        database().ref(this.roomPath).on(VALUE_CHANGED_EVENT, (snapshot) => {
            this.onContentChangeCb(snapshot.val().content);
        });
        this.isConnected = true;
    }

    /**
     * Create a new shared room and connect to it
     *
     * @memberOf Room
     */
    public create(): void {
        database().ref(this.roomPath).set({
            content: '',
            cursors: []
        });
    }

    /**
     * Stop listening for changes in a room
     *
     * @returns {void}
     *
     * @memberOf Room
     */
    public disconnect(): void {
        if (!this.isConnected) {
            return;
        }
        database().ref(this.roomPath).off(VALUE_CHANGED_EVENT);
    }

    /**
     * Set the content of a room, useful to be applied as a callback somewhere
     *
     * @param {any} content
     * @returns {void}
     *
     * @memberOf Room
     */
    public setContent(content): void {
        if (!this.isConnected) {
            return;
        }
        database().ref(this.roomPath).set({
            content: content,
            cursors: []
        });
    }

    /**
     * Get a list of all rooms available.
     *
     * @static
     * @returns {Thenable<string[]>}
     *
     * @memberOf Room
     */
    public static getRoomNames(): Thenable<string[]> {
        return database().ref('rooms/').once(VALUE_CHANGED_EVENT, snapshot => {
            return Object.keys(snapshot.val());
        });
    }
}
