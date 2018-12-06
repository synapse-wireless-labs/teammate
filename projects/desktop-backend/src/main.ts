import {app, ipcMain, BrowserWindow, Menu} from 'electron';
import * as path from "path";
import * as url from "url";

const electronOauth2 = require('electron-oauth2');
const oauthConfig = require('./config').oauth;
const outlookOAuth = electronOauth2(oauthConfig, windowParams);


let win: BrowserWindow | null = null;

app
  .commandLine
  .appendSwitch('enable-web-bluetooth', 'true');

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `../../desktop-ui/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });
}

ipcMain.on('outlook-oauth', (event, arg) => {
  outlookOAuth.getAccessToken({})
    .then(token => {
      event.sender.send('outlook-oauth-reply', token);
    }, err => {
      console.log('Error while getting token', err);
    });
});


app.on("ready", createWindow);

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
