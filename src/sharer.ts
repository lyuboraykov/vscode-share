import * as vscode from 'vscode';

import Room from './room';

export default class Sharer {

    /**
     * Initiate the command to create a room
     *
     * @static
     *
     * @memberOf Sharer
     */
    public static shareCommand(): void {
        vscode.window.showInputBox().then(roomName => {
            if (!roomName) {
                return;
            }
            const room = new Room(roomName, Sharer.setEditorContent);
            room.create();
            Sharer.connectToRoom(roomName);
        });
    }

    /**
     * Execute the command to connect to a room
     *
     * @static
     *
     * @memberOf Sharer
     */
    public static connectToRoomCommand(): void {
        vscode.window.showQuickPick(Room.getRoomNames()).then(roomName => {
            if (roomName) {
                Sharer.connectToRoom(roomName);
            }
        });
    }

    /**
     * Hook the events for connecting to a room
     *
     * @private
     * @static
     * @param {string} roomName
     *
     * @memberOf Sharer
     */
    private static connectToRoom(roomName: string): void {
        const room = new Room(roomName, Sharer.setEditorContent);
        room.connect();
        vscode.workspace.onDidChangeTextDocument(changeEvent => {
            room.setContent(changeEvent.document.getText());
        });
    }

    /**
     * Update the text content of the active editor
     *
     * @private
     * @static
     * @param {string} content
     *
     * @memberOf Sharer
     */
    private static setEditorContent(content: string): void {
        const currentContent = vscode.window.activeTextEditor.document.getText();
        if (content != currentContent) {
            vscode.window.activeTextEditor.edit(edit => {
                const lastLine = vscode.window.activeTextEditor.document.lineCount;
                const lastChar = currentContent.length;
                edit.replace(new vscode.Range(0, 0, lastLine, lastChar), content);
            });
        }
    }
}
