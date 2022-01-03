'use strict'

require('v8-compile-cache')
const {app, ipcMain,protocol} = require('electron')
const Store = require('electron-store')
const config = new Store()

if (!app.requestSingleInstanceLock()){app.quit()}

const switchLoader = require('./loaders/switchLoader')
switchLoader(app, config)
const windowLoader = require('./loaders/windowLoader')

app.once('ready', () => {
	protocol.registerFileProtocol('null-swap', (request, callback) => {
		callback(decodeURI(request.url.replace(/null-swap:/, '')))
	})
	windowLoader.initSplashWin(config)
})
app.on('window-close-all', () => {
    app.quit();
})
ipcMain.handle('get-app-info', () => ({
	name: app.name,
	version: app.getVersion(),
	platform: process.platform,
}))