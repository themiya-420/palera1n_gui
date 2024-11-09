const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');

let mainWindow;
let palera1nProcess;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadFile('index.html');
});

ipcMain.on('run-palera1n-command', (event, command) => {
  let palera1nCommand;

  switch (command) {
    case 'rootful':
      palera1nCommand = 'palera1n -f';
      break;
    case 'createfakefs':
      palera1nCommand = 'palera1n -B createfakefs';
      break;
    case 'rootless':
      palera1nCommand = 'palera1n -B rootless';
      break;
    case 'restore':
      palera1nCommand = 'palera1n -B restore';
      break;
    default:
      console.error('Unknown command:', command);
      return;
  }

  // Start palera1n process
  palera1nProcess = exec(palera1nCommand);

  palera1nProcess.stdout.on('data', (data) => {
    mainWindow.webContents.send('terminal-output', data);
  });

  palera1nProcess.stderr.on('data', (data) => {
    mainWindow.webContents.send('terminal-output', data);
  });
});

// Handle Enter key press to send to palera1n process
ipcMain.on('enter-key-pressed', () => {
  if (palera1nProcess) {
    palera1nProcess.stdin.write('\n'); // Sends an Enter key (newline) to the process
  }
});
