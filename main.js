const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer")

app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify();
});

let win

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    })

    win.loadFile(path.join(__dirname, 'ui', 'index.html'))

    if (!app.isPackaged) {
        win.webContents.openDevTools()
    }
}

app.whenReady().then(() => {
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((ex_name) => console.log(`Added "${ex_name}" Extension`))
        .catch((err) => console.log("An error occured when attempting to install extensions:", err))

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
