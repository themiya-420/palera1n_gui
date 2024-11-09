const { ipcRenderer } = require('electron');

function runCommand(command) {
  ipcRenderer.send('run-palera1n-command', command);
}

ipcRenderer.on('terminal-output', (event, data) => {
  const outputDiv = document.getElementById('output');
  outputDiv.innerText += data;

  // Scroll to the bottom
  outputDiv.scrollTop = outputDiv.scrollHeight;
});

// Listen for the Enter key press
window.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    ipcRenderer.send('enter-key-pressed');
  }
});
