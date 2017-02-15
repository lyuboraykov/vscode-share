import * as vscode from 'vscode';

import Room from './room';
import {guid} from './utils';

export default class Sharer {

    private static editorGuid = guid();

    /**
     * Initiate the command to create a room
     *
     * @static
     *
     * @memberOf Sharer
     */
    public static shareCommand(): void {
        const message = 'Enter a connection name';
        vscode.window.showInputBox({prompt: message}).then(roomName => {
            if (!roomName) {
                return;
            }
            const room = new Room(roomName, Sharer.setEditorContent);
            room.create(Sharer.editorGuid);
            Sharer.connectToRoom(roomName);
            vscode.window.showInformationMessage(`Sharing to ${roomName}.`)
            const fileName = vscode.window.activeTextEditor.document.fileName;
            vscode.window.setStatusBarMessage(`Sharing ${fileName} to ${roomName}`);
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
            vscode.window.showInformationMessage('Connected.')
            vscode.window.setStatusBarMessage(`Connected to ${roomName}`);
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
            room.setContent(changeEvent.document.getText(), Sharer.editorGuid);
        });
        vscode.workspace.onDidCloseTextDocument(changeEvent => {
            room.disconnect();
            vscode.window.setStatusBarMessage('');
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
    private static setEditorContent(content: string, lastEditBy: string): void {
        if (lastEditBy !== Sharer.editorGuid) {
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
}
