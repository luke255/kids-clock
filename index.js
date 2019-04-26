let win, platformMap = {
        'Linux': 'linux',
        'Darwin': 'mac',
        'Windows_NT': 'windows'
    },
    pkg = require('./package.json'),
    mainTitle = pkg.productName;
const {
        app,
        BrowserWindow
    } = require('electron'), dev = !app.isPackaged,
    os = require('os'),
    path = require('path'),
    platform = platformMap[os.type()];
app.setName(mainTitle);

function createWindow() {
    let options = {
        title: mainTitle,
        acceptFirstMouse: true,
        backgroundColor: '#000',
        show: dev,
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    };
    if (platform === 'linux') {
        options.icon = path.join(__dirname, '/icon.svg');
    }
    win = new BrowserWindow(options);
    win.setMenu(null);
    win.loadFile(path.join(__dirname, '/index.html'));
    win.once('ready-to-show', function() {
        win.show();
        win.setFullScreen(true);
    });
    win.on('closed', function() {
        win = null;
    });
}
app.on('ready', function() {
    createWindow();
});
app.on('window-all-closed', function() {
    app.quit();
});
app.on('activate', function() {
    if (win === null) {
        createWindow();
    }
});