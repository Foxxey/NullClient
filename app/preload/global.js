'use strict'

require('v8-compile-cache')
const events = require('events')
const {locationTest} = require('../utils/utils.js')
let location_ = locationTest(window.location.href)
const Store = require('electron-store')
const config = new Store()
const log = require("electron-log")

window.nullUtil = {
	//load settings
    settings: require('../data/settings'),
	//arrow function would give an error with the object
	setClientSetting: function (name, value) {
		let entry
		Object.keys(this.settings).forEach((category) => {
			let setting_ = Object.keys(this.settings[category].settings).filter((setting) => {
				if(this.settings[category].settings[setting].id === name) {
					return this.settings[category].settings[setting]
				}
			}).map(key => this.settings[category].settings[key])
			if(setting_.length) {
				entry = setting_[0]
			}
		})
		if(entry.min && entry.max) {
			value = Math.max(entry.min, Math.min(value, entry.max))
		}
		config.set(name, value)
		entry.value = value
		if(entry.set) entry.set(value)
		let element = document.getElementById('c_slid_' + entry.id)
		if(element) element.value = value
		element = document.getElementById('c_slid_input_' + entry.id)
		if(element) element.value = value
	},
	//arrow function would give an error with the object
	initUtil: async function()  {
		for (let key of Object.entries(this.settings)) {
			for (let key_ of Object.entries(key[1].settings)) {
				let entry = key_[1]
				let configValue = config.get(entry.id)
				if(configValue != null) {
					entry.value = configValue
				}
				if(entry.min && entry.max) {
					entry.value = Math.max(entry.min, Math.min(entry.value, entry.max))
				}
				if(entry.set) {
					entry.set(entry.value, true)
				}
			}
		}
	},
	//to add client events
	events: new events()
}

// removed required files for social and editor
switch(location_) {
	case 'game':
		window.nullUtil.events.on('game-loaded',() => {
			window.nullUtil.initUtil()
		})
		require('./game.js')
		break
	case 'social':
		//require('./social.js')
		break
	case 'editor':
		//editor feature (custom css) in progress
		break
	case 'viewer':
		//maybe some features soon
		break
}
