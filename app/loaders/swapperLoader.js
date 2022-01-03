'use strict'


/* inspired by https://github.com/Mixaz017/idkr (pre-AGPL) permission through NullDev */


const path = require('path')
const fs = require('fs')

let ensureDir = (path) => {
    try{
        if(!fs.existsSync(path)){
            fs.mkdirSync(path,{
                recursive:true
            })
        }
    }catch(err){console.error(err)}
}

class swapper {
    constructor(win, app) {
        this.win = win
        this.app = app
        this.swapDir = path.join(app.getPath('documents'), 'Null-Client/swap')
        ensureDir(this.swapDir)
        this.urls = []
    }
    #recursiveSwap = (win, name = '') => {
        try {
            fs.readdirSync(path.join(this.swapDir, name), {
                withFileTypes: true
            }).forEach(dirent => {
                if(dirent.isDirectory()) {
                    this.#recursiveSwap(win,`${name}/${dirent.name}`)
                } else {
                    let pathname = `${name}/${dirent.name}`
                    //using regexp
                    //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
                    let isAsset = /^\/(models|textures|sound)($|\/)/.test(pathname)
                    if (isAsset) {
                        this.urls.push(`*://assets.krunker.io${pathname}`, `*://assets.krunker.io${pathname}?*`)
                    } else {
                        this.urls.push(`*://krunker.io${pathname}`, `*://krunker.io${pathname}?*`, `*://comp.krunker.io${pathname}`, `*://comp.krunker.io${pathname}?*`)
                    }
                }
            })
        } catch (err) {
            console.error('Failed to swap resources', err, name)
        }
    }
    load() {
        this.#recursiveSwap(this.win)
        if(this.urls.length) {
            this.win.webContents.session.webRequest.onBeforeRequest({
                urls: this.urls
            }, (details, callback) => callback({
                redirectURL: 'null-swap:/' + path.join(this.swapDir, new URL(details.url).pathname)
            }))
        }
    }
}
module.exports = swapper
