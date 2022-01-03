'use strict'

const path = require('path')
const {app, BrowserWindow, shell} = require('electron')
const shortcuts = require('electron-localshortcut')
const {locationTest} = require('../utils/utils')
const swapperLoader = require('./swapperLoader')

class windowLoader {
    static initWin (url, config, webContents) {
        let win = new BrowserWindow({
            width: 1600,
            height: 900,
            show: false,
            icon: __dirname + '/media/icon.ico',
            webPreferences: {
                contextIsolation: false,
                preload: path.join(__dirname, '../preload/global.js'),
            },
        })
        let contents = win.webContents
        win.openDevTools()
        win.removeMenu()
        win.once('ready-to-show',() => {
            let location_ = locationTest(contents.getURL())
            //handels event for windowstate changes
            //https://www.electronjs.org/docs/latest/api/browser-window
            win.on('maximize', () => {
                config.set(`windowState.${location_}.max`, true)
            })
            win.on('unmaximize', () => {
                config.set(`windowState.${location_}.max`, false)
            })
            win.on('enter-full-screen', () => {
                config.set(`windowState.${location_}.full`, true)
            })
            win.on('leave-full-screen', () => {
                config.set(`windowState.${location_}.full`, false)
            })
            //loads saved windowstate
            let windowStateConfig = config.get('windowState.' + location_, {})
            if(windowStateConfig.max) {
                win.maximize()
            }
            if(windowStateConfig.full) {
                win.setFullScreen(true)
            }
            win.setTitle("NullClient")
            win.webContents.on("did-finish-load", () => {
                win.setTitle("NullClient")
            })
            win.setTitle = ()=>{}
            win.show()
        })
        shortcuts.register(win, 'Esc', () => {
            contents.executeJavaScript('document.exitPointerLock()', true)
        })
        shortcuts.register('F11', () => {
            win.setFullScreen(!win.isFullScreen())
        })
        shortcuts.register(win, 'F5', () => {
            contents.reload()
        })

        contents.on('dom-ready', () => {
            if(locationTest(contents.getURL()) === 'game') {
                shortcuts.register(win, 'F6', () => {
                    win.loadURL('https://krunker.io/')
                })
            }
        })
        contents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures, referrer, postBody) => {
			event.preventDefault()
			if(locationTest(url) === 'external') {
                shell.openExternal(url)
            }
			else if(locationTest(url) !== 'unknown') {
				if(frameName === '_self') {
                    contents.loadURL(url)
                }
				else {
                    this.initWin(url, config, options.webContents)
                }
			}
		})
        contents.on('will-navigate', (event, url) => {
			event.preventDefault()
			if(locationTest(url) === 'external') {
                shell.openExternal(url)
            }
			else if(locationTest(url) !== 'unknown') {
                contents.loadURL(url)
            }
		})
        if(config.get('use_swapper', true)) {
            let swapper_ = new swapperLoader (win, app)
            swapper_.load()
        }
        if(!webContents) {
            win.loadURL(url)
        }
        return win
    }
    static initSplashWin(config){
        let splash = new BrowserWindow({
            width: 600,
            height: 300,
            center: true,
            resizable: false,
            show: false,
            frame: false,
            transparent: true,
            webPreferences: {
                preload: path.join(__dirname, '../preload/splash.js')
            }
        })
        splash.once('ready-to-show', () => {
            splash.show()
        })
        let contents = splash.webContents
        // https://www.electron.build/auto-update.html
        async function autoUpdate(){
            return new Promise((resolve, reject) => {
                return contents.on('dom-ready', () => {
                    contents.send('message', 'Initializing the auto-updater...')
                    const {autoUpdater} = require('electron-updater')
                    autoUpdater.on('error', err => {
                        console.error(err)
                        contents.send('message', 'Error: ' + err.name)
                        reject(`Error occurred: ${err.name}`)
                    })
                    autoUpdater.on('checking-for-update', () => {
                        contents.send('message', 'Checking for update...')
                    })
                    autoUpdater.on('update-available', info => {
                        console.log(info)
                        contents.send('message', `Update v${info.version} available.`, info.releaseDate)
                    })
                    autoUpdater.on('update-not-available', info => {
                        console.log(info)
                        contents.send('message', 'No update available.')
                        resolve()
                    })
                    autoUpdater.on('download-progress', info => {
                        contents.send('message', `Downloaded ${Math.floor(info.percent)}%`, Math.floor(info.bytesPerSecond/1000) + 'kB/s')
                        win.setProgressBar(info.percent / 100)
                    })
                    autoUpdater.on('update-downloaded', info => {
                        contents.send('message', null, `Installing v${info.version}`)
                        autoUpdater.quitAndInstall(true, true)
                    })
                    autoUpdater.autoDownload = true
                    autoUpdater.checkForUpdates()
                })
            })
        }
        function launchGame(){
            setTimeout(() => {
                windowLoader.initWin('https://krunker.io/', config)
                splash.destroy()
            }, 3000)
        }
        autoUpdate().finally(() => launchGame())
        splash.loadFile('app/html/splash.html')
    }
}
module.exports = windowLoader