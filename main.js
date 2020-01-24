// Modules to control application life and create native browser window
'use strict';

const {app, electron, BrowserWindow, ipcMain, Menu, MenuItem, shell, dialog, webContents} = require('electron')
const path = require('path')
const url = require('url')
const mongoose = require("mongoose");
const updater = require("./js/updater");
const {autoUpdater} = require("electron-updater");
const log = require('electron-log');
require('electron-reload')(__dirname);

const fs = require('fs');
const os = require('os');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
// log.info('App starting...');
autoUpdater.autoDownload = false

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let switchProcessWindow

function createWindow () {

  setTimeout( updater, 3000);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


exports.createSwitchProcessWindow = () => {
  // Create the browser window.
  switchProcessWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    // resizable: false,
    // maximizable: false,
    // transparent: true,
    darkTheme: true,
    // frame: false,
    scrollable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })


  // and load the index.html of the app.
  switchProcessWindow.loadFile('switchProcess.html')

  // Menu.setApplicationMenu(mainMenu);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  // signinWindow.on('blur', () => {
  //     signinWindow.close();
  // })


  switchProcessWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    switchProcessWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

//Show version on index.html
ipcMain.on('app_version', (event) => {
  const answer = ["Confirm", "Cancel"];
  event.sender.send('app_version', { version: app.getVersion() });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
