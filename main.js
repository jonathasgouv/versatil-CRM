const { app, BrowserWindow, Menu } = require('electron');
const shell = require('electron').shell;
const fs = require('fs');
//ipc = require('electron').ipcMain

/* function janela() {
  const secondwin = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true,
      alwaysOnTop: true,
      webPreferences: {
          nodeIntegration: true
      }
    })
    secondwin.on('close', function() {secondwin = null})
    secondwin.removeMenu()
    secondwin.loadFile('editar.html')
    secondwin.show()
    secondwin.webContents.openDevTools()
    return secondwin
} */

function createWindow() {
	// Cria uma janela de navegação.
	const win = new BrowserWindow({
		width          : 900,
		height         : 700,
		frame          : false,
		webPreferences : {
			nodeIntegration : true,
			webviewTag      : true
		}
	});

	// and load the index.html of the app.
	win.loadFile('src/login/login.html');
	win.removeMenu();

	// Open the DevTools.
	win.webContents.openDevTools();
	win.on('closed', () => app.quit());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// No macOS é comum para aplicativos e sua barra de menu
	// permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.allowRendererProcessReuse = true;

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.

/* ipc.on('clientedit', function(event, arg) {
  janela().webContents.send('clientatt', arg)
}) */
