import * as vscode from 'vscode';

import Session from './session';
import {guid} from './utils';

export default class Sharer {

    private static editorGuid = guid();

    /**
     * Initiate the command to open a sharing session
     *
     * @static
     *
     * @memberOf Sharer
     */
    public static shareCommand(): void {
        const message = 'Enter the name of your session: ';
        vscode.window.showInputBox({prompt: message}).then(sessionName => {
            if (!sessionName) {
                vscode.window.showErrorMessage('You need to enter a session name');
                return;
            }
            const session = new Session(sessionName, Sharer.setEditorContent);
            session.create(Sharer.editorGuid);
            Sharer.connectToSession(sessionName);
            vscode.window.showInformationMessage(`Sharing to ${sessionName}.`)
            const fileName = vscode.window.activeTextEditor.document.fileName;
            vscode.window.setStatusBarMessage(`Sharing ${fileName} to ${sessionName}`);
        });
    }

    /**
     * Execute the command to connect to a session
     *
     * @static
     *
     * @memberOf Sharer
     */
    public static connectToSessionCommand(): void {
        vscode.window.showQuickPick(Session.getSessionNames()).then(sessionName => {
            if (sessionName) {
                Sharer.connectToSession(sessionName);
            }
            vscode.window.showInformationMessage('Connected.')
            vscode.window.setStatusBarMessage(`Connected to ${sessionName}`);
        });
    }

    /**
     * Hook the events for connecting from a session
     *
     * @private
     * @static
     * @param {string} sessionName
     *
     * @memberOf Sharer
     */
    private static connectToSession(sessionName: string): void {
        const session = new Session(sessionName, Sharer.setEditorContent);
        session.connect();
        vscode.workspace.onDidChangeTextDocument(changeEvent => {
            session.setContent(changeEvent.document.getText(), Sharer.editorGuid);
        });
        vscode.workspace.onDidCloseTextDocument(changeEvent => {
            session.disconnect();
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
