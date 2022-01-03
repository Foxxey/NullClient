
const features = require('../features/features.js')
const Store = require('electron-store')
const config = new Store()
const log = require("electron-log")


let settingsWindow = null

Object.assign(window.nullUtil, {
	searchMatches: entry => {
		let query = settingsWindow.settingSearch.toLowerCase() || ''
		return (entry.name.toLowerCase() || '').includes(query) || (entry.category.toLowerCase() || '').includes(query)
	},
	genCSettingsHTML: options => {
		//html copied from krunker settings tab
		//bit older, somethings need to be fixed?
		switch (options.type) {
			case 'checkbox':
				return `<label class='switch'><input type='checkbox' onclick='nullUtil.setClientSetting("${options.id}", this.checked)'${options.value ? ' checked' : ''}><span class='slider'></span></label>`
			case 'slider':
				return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.value}' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.value}' class='sliderM' oninput='nullUtil.setClientSetting("${options.id}", this.value)'></div>`
			case 'select':
				return `<select onchange='nullUtil.setClientSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] == options.value ? ' selected' : ''}>${entry[1]}</option>`).join('')}</select>`
			case 'color' :
				return `<input type='color' name='color' id='slid_${options.id}' style='float:right' value='${options.value}' onchange='nullUtil.setClientSetting("${options.id}", this.value)'>`
			case 'text' :
				return `<input type='text' name='text' id='slid_${options.id}' class='inputGrey2' placeholder='${options.placeholder}' value='${options.value}' oninput='nullUtil.setClientSetting("${options.id}", this.value)'>`
		}
	},
	setCSS: (value) => {
		switch(value) {
			case 'none' :
				gameCSS.innerHTML = ''
				document.querySelectorAll("link[href^='/css/main_custom.css']")[0].rel = ''
				break
			case 'swapper' :
				gameCSS.innerHTML = ''
				if(document.querySelectorAll("link[href^='/css/main_custom.css']")[0].rel != 'stylesheet'){
					document.querySelectorAll("link[href^='/css/main_custom.css']")[0].rel = 'stylesheet'
				}
				break
		}
	},
	//should be changed (maybe)
	features: features
})
//no download official client popup
window.OffCliV = true

document.addEventListener('DOMContentLoaded', () => {
	let windowsObserver = new MutationObserver(() => {
		windowsObserver.disconnect()
		//emits when game is loaded
		window.nullUtil.events.emit('game-loaded')
	})
	//using the 'click to play' because it appears after the game is loaded
	windowsObserver.observe(document.getElementById('instructions'), {childList: true})
	//shows Client verison
	document.getElementById('curGameInfo').id = 'CVersion'
	document.getElementById('CVersion').style.color = '#ffffff'
	document.getElementById('CVersion').innerText = 'Null Client v.0.0.2' //need to get version through ipc get-app-info
	//custom css
	const gameCSS = Object.assign(document.createElement('style'))  //need to fix bug with nasa css
	gameCSS.id = 'gameCSS'
    document.head.appendChild(gameCSS)
	window.nullUtil.setCSS(config.get('customCSS'))
	createWatermark()
	
	//load sky color
	/*
	log.log('skyCol', config.get('use_sky_col'))
	if(config.get('use_sky_col')) {
		log.log('skycol init')
		features.skyColor.init(config.get('skyCol', '#000000'))
	}
	*/
})

function createWatermark() {
	const watermark = document.createElement('div')
	watermark.id = 'watermark'
	watermark.style.position = 'absolute'
	watermark.style.color = 'rgba(0,0,0, 0.3)'
	watermark.style.bottom = '1px'
	watermark.style.left = '20px'
	watermark.style.fontSize = '9pt'
	watermark.innerHTML = 'Null Client v.0.0.2'
	inGameUI.appendChild(watermark)
}

window.nullUtil.events.on('game-loaded', () => {
	settingsWindow = window.windows[0]
	removeClientTab()
	let default_getSettings = settingsWindow.getSettings
	
	settingsWindow.getSettings = (...args) => {
		//replace with regexp
		//https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/replace
		let settings = default_getSettings.call(settingsWindow, ...args).replace(/^<\/div>/, '')
		settings += settingsWindow.getClientSettings()
		return settings
	}
	let clientTabIndex = settingsWindow.tabs.push({ name: 'Null', categories: [] }) - 1 //add null
	settingsWindow.getClientSettings = () => {
		if (clientTabIndex != settingsWindow.tabIndex && !settingsWindow.settingSearch) {
			return
		}
		let temp = ''
		let settings = window.nullUtil.settings
		for(let cat in settings) {
			let category = settings[cat]
			temp += `<div class='setHed' id='setHed_${category.name}' onclick='window.windows[0].collapseFolder(this)'><span class='material-icons plusOrMinus'>keyboard_arrow_down</span> ${category.name}</div><div class='setBodH' id='setBod_${category.name}'>`
			for(let key in category.settings) {
				let option = category.settings[key]
				temp += `<div class='settName' ${option.info ? `title='${option.info}'` : (option.needsRestart ? 'title="Requires Restart"': '')}${option.needsRestart ? ' title="Requires Restart"' : ''}>${option.name} ${option.needsRestart ? ' <span style="color: #eb5656">*</span>' : ''} ${option.html()}</div>`
			}
			temp += '</div>'
		}
		return temp
	}
})
function removeClientTab() {
    var clienttabhide = document.getElementById('uiBase')
    var styleElement = document.createElement('style')
    styleElement.innerHTML = `.settingTab:nth-child(7) {display: none;`
    clienttabhide.prepend(styleElement)
}

