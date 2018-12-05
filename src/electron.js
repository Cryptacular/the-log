const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let win = null;

const startUrl =
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(__dirname, "/../build/index.html"),
    protocol: "file:",
    slashes: true
  });

function createWindow() {
  win = new BrowserWindow({
    backgroundColor: "#ff8c25",
    height: 600,
    titleBarStyle: "hiddenInset",
    width: 1024
  });

  win.loadURL(startUrl);
}

app.on("ready", createWindow);
