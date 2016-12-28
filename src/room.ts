import {database} from 'firebase';
import * as vscode from 'vscode';


const VALUE_CHANGED_EVENT = 'value';


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
        firebase.database().ref(`rooms/${this.roomName}`).on(VALUE_CHANGED_EVENT, (snapshot) => {
            // set document content here or use some cb?
        });
    }

    public create(): void {

    }

    public disconnect(): void {
        if (!this.isConnected) {
            return;
        }
        firebase.database().ref(`rooms/${this.roomName}`).off(VALUE_CHANGED_EVENT);
    }

    public static getRoomNames(): Thenable<any> {
        return firebase.database().ref('rooms/').once(VALUE_CHANGED_EVENT, snapshot => {
            return Object.keys(snapshot.val());
        });
    }
}
