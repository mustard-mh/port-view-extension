import * as vscode from "vscode";
import dataJson from './a.json';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const provider = new TestProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(TestProvider.viewType, provider)
    );
    vscode.commands.executeCommand('setContext', 'forwardedPortsViewEnabled', true);
}

export function deactivate() { }

type PortCommand = "openBrowser" | "openPreview" | "makePublic" | "makePrivate";

class TestProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "calicoColors.colorsView";

    public _view?: vscode.WebviewView;

    constructor(private readonly context: vscode.ExtensionContext) {
        setTimeout(() => {
            this._view?.webview.postMessage({ command: "updatePorts", ports: dataJson });
        }, 1000);
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        this.onHtmlCommand();
    }

    private async onHtmlCommand() {
        this._view?.webview.onDidReceiveMessage(async (message: { command: string, port: any }) => {
            const command = message.command;
            const port = JSON.stringify(message.port);
            if (command === "urlCopy") {
                await vscode.env.clipboard.writeText(message.port.status.exposed.url);
                return;
            }
            vscode.window.showInformationMessage(`${command} - ${port}`);
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "compiled/bundle.js"));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "compiled/bundle.css"));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    http-equiv="Content-Security-Policy"
                    content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                <link href="${styleUri}" rel="stylesheet" />
                <script nonce="${nonce}">
                    const vscode = acquireVsCodeApi(); 
                </script>

                <title>Gitpod Port View</title>
            </head>

            <body></body>
            <script nonce="${nonce}" src="${scriptUri}"></script>
            </html>`;
    }
}

function getNonce() {
    let text = "";
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
