import * as vscode from 'vscode';

import Room from './room';

export default class Sharer {
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

    public static connectToRoomCommand(): void {
        Room.getRoomNames().then(roomNames => {
            return vscode.window.showQuickPick(roomNames);
        }).then(roomName => {
            if (roomName) {
                Sharer.connectToRoom(roomName);
            }
        });
    }

    private static connectToRoom(roomName: string): void {
        const room = new Room(roomName, Sharer.setEditorContent);
        room.connect();
        vscode.window.onDidChangeActiveTextEditor(editor => {
            room.setContent(editor.document.getText());
        });
    }

    private static setEditorContent(content: string): void {
        vscode.window.activeTextEditor.edit(edit => {
            edit.replace(new vscode.Position(0, 0), content);
        });
    }
}
