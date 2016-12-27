'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as firebase from 'firebase';
import * as vscode from 'vscode';

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

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.shareEditor', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('You\'re sharing your editor!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
