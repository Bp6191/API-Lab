// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "api-lab" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('api-lab.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from http-testerAPI-lab!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';


export function activate(context: vscode.ExtensionContext) {
  vscode.window.showInformationMessage('API Lab activated');

  const disposable = vscode.commands.registerCommand(
    'apiLab.sendRequest',
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
      }

      const env = loadEnvVars();
      const content = resolveEnv(editor.document.getText(), env);

      const request = parseHttp(content);

    //   console.log('FINAL REQUEST OBJECT:', request);
	// console.log('FINAL URL:', request?.url);


      if (!request) {
        vscode.window.showErrorMessage('Invalid HTTP request format');
        return;
      }

      try {
        const start = Date.now();
        const response = await axios({
          method: request.method,
          url: request.url,
          headers: request.headers,
          data: request.body
        });

        const time = Date.now() - start;
        showResponse(response, time);

      } catch (err: any) {
        console.error('AXIOS ERROR:', err);

        if (err.response) {
          vscode.window.showErrorMessage(
            `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
          );
        } else if (err.request) {
          vscode.window.showErrorMessage(
            'Request was sent but no response received'
          );
        } else {
          vscode.window.showErrorMessage(
            `Error: ${err.message}`
          );
        }
      }
    }
  );

  // CORRECT PLACE
  context.subscriptions.push(disposable);
}


export function deactivate() {}
function parseHttp(text: string) {
  const lines = text.split('\n');
  const [method, url] = lines[0].split(' ');

  if (!method || !url) return null;

  const headers: Record<string, string> = {};
  let bodyStart = -1;

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      bodyStart = i + 1;
      break;
    }
    const [key, ...value] = lines[i].split(':');
    headers[key.trim()] = value.join(':').trim();
  }

  let body;
  if (bodyStart !== -1) {
    const rawBody = lines.slice(bodyStart).join('\n').trim();
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = rawBody;
      }
    }
  }

  return { method, url, headers, body };
}
function showResponse(response: any, time: number) {
  const panel = vscode.window.createWebviewPanel(
    'apiLabResponse',
    'API Lab Response',
    vscode.ViewColumn.Beside,
    {}
  );

  panel.webview.html = `
    <html>
      <body>
        <h2>Status: ${response.status}</h2>
        <p>Time: ${time} ms</p>

        <h3>Headers</h3>
        <pre>${JSON.stringify(response.headers, null, 2)}</pre>

        <h3>Body</h3>
        <pre>${JSON.stringify(response.data, null, 2)}</pre>
      </body>
    </html>
  `;
}

function loadEnvVars(): Record<string, string> {
  const env: Record<string, string> = {};

  if (!vscode.workspace.workspaceFolders) {
    return env;
  }

  for (const folder of vscode.workspace.workspaceFolders) {
    const envPath = path.join(folder.uri.fsPath, 'api-lab.env.json');

    if (fs.existsSync(envPath)) {
      try {
        return JSON.parse(fs.readFileSync(envPath, 'utf-8'));
      } catch {
        vscode.window.showErrorMessage(
          'Invalid api-lab.env.json format'
        );
      }
    }
  }

  return env;
}



function resolveEnv(value: string, env: Record<string, string>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return env[key] ?? `{{${key}}}`;
  });
}

