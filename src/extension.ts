'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as firebase from 'firebase';
import * as vscode from 'vscode';
import Sharer from './sharer';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const config = {
        apiKey: "AIzaSyBvDvfsYtUxMg4kW22EilVC0z6T76q5_q4",
        authDomain: "vscode-share.firebaseapp.com",
        databaseURL: "https://vscode-share.firebaseio.com",
        storageBucket: "vscode-share.appspot.com",
        messagingSenderId: "1000407796204"
    };
    firebase.initializeApp(config);

    let disposableSharer = vscode.commands.registerCommand('extension.openSession', () => {
        Sharer.shareCommand();
    });

    let disposableConnector = vscode.commands.registerCommand('extension.connectToSession', () => {
        Sharer.connectToSessionCommand();
    });

    context.subscriptions.push(disposableSharer);
    context.subscriptions.push(disposableConnector);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
