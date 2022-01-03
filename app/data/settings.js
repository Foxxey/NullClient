/*

html needs to be function(){} to access this
() => {} can not access this

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

*/

const log = require('electron-log')

module.exports = {
	performance: {
		name: 'Performance',
		settings: {
			disableFrameRateLimit: {
				name: 'Unlimited FPS',
				id: 'disableFrameRateLimit',
				type: 'checkbox',
				value: true,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				}
			},
			acceleratedCanvas: {
				name: 'Accelerated Canvas',
				id: 'acceleratedCanvas',
				type: 'checkbox',
				value: true,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
			},
			high_performance_gpu: {
				name: 'Force High Performance GPU',
				id: 'high_performance_gpu',
				type: 'checkbox',
				value: true,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Forces the client to use high performance of the GPU. If you have problems with recoring, disable this setting.'
			},
			angleBackend: {
				name: 'ANGLE Graphics Backend',
				id: 'angle_backend',
				type: 'select',
				options: {
					default: 'Default',
					gl: 'OpenGL',
					d3d11: 'D3D11',
					d3d9: 'D3D9',
					d3d11on12: 'D3D11on12'
				},
				value: 'default',
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Choose the graphics backend for ANGLE.'
			},
		}
	},
	chromium: {
		name: 'Chromium',
		settings: {
			colorProfile: {
				name: 'Color Profile',
				id: 'color_profile',
				type: 'select',
				options: {
					default: 'Default',
					srgb: 'sRGB',
					'display-p3-d65': 'Display P3 D65',
					'color-spin-gamma24': 'Color spin with gamma 2.4'
				},
				value: 'default',
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Select a color profile.'
			},
			inProcessGPU: {
				name: 'In-Process GPU',
				id: 'in_process_gpu',
				type: 'checkbox',
				value: true,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Run the GPU process as a thread in the browser process.'
			},
			chromiumFlags: {
				name: 'Chromium Flags',
				id: 'chromium_flags',
				type: 'text',
				value: '',
				placeholder: '--flag=value',
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Additional Chromium flags can be added here.'
			},
			enablePointerLockOptions: {
				name: 'Pointer Raw Input (experimental)',
				id: 'enable_pointer_lock_options',
				type: 'checkbox',
				value: false,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				}
			},
		}
	},
	interface: {
		name: 'Interface',
		settings: {
			showExitButton: {
				name: 'Show Exit Button',
				id: 'show_exit_button',
				type: 'checkbox',
				value: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					let c_exit = document.getElementById('clientExit')
					if(c_exit) {
						c_exit.style.display = value ? 'flex' : 'none'
					}
				}
			},
			useSwapper: {
				name: 'Resourceswapper',
				id: 'use_swapper',
				type: 'checkbox',
				value: false,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				}
			},
		}
	},
	gameplay: {
		name: 'Gameplay',
		settings: {
			autoSpectate: {
				name: 'Auto Spectate',
				id: 'auto_spectate',
				type: 'checkbox',
				value: false,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					let spectateButton = document.getElementById('specBtn')
					if(spectateButton && spectateButton.checked != value) {
						spectateButton.click()
					}
				}
			},
			menuTimer: {
				name: 'Menu Timer',
				id: 'menu_timer',
				type: 'checkbox',
				value: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					window.nullUtil.features.menuTimer.toggle(value)
				}
			},
			/*
			useSkyCol: {
				name: 'Use Custom Sky Color',
				id: 'use_sky_col',
				type: 'checkbox',
				value: false,
				needsRestart: true,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				info: 'Use a custom sky color. If you change the color a restart is required.'
			},
			skyCol: {
				name: 'Custom Sky Color',
				id: 'sky_col',
				type: 'color',
				value: '#000000',
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					window.nullUtil.features.skyColor.changeColor(value)
				},
				info: 'Select a custom Sky color. If you change the color a restart is required.'
			},
			*/
			customCSS: {
				name: 'Custom CSS',
				id: 'customCSS',
				type: 'select',
				options: {
					none: 'None',
					swapper: 'Resourceswapper',
					Javn: 'Javn',
				},
				value: 'swapper',
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					window.nullUtil.setCSS(value)
				},
				info: 'Choose a custom css script.'
			},
		}
	},
	keystrokes: {
		name: 'Keystrokes',
		settings: {
			keystrokes: {
				name: 'Keystrokes',
				id: 'keystrokes',
				type: 'checkbox',
				value: false,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					if(value) {
						window.nullUtil.features.keystrokes.create(2,2,1)
					}
					else {
						window.nullUtil.features.keystrokes.remove()
					}
				},
				info: 'Shows the input of WASD from your keyboard.'
			},
			keystrokes_size: {
				name: 'Keystrokes Size',
				id: 'keystrokes_size',
				type: 'slider',
				min: 0,
				max: 3,
				step: 0.1,
				value: 2,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					if(value && document.getElementById('keystrokes') != null) {
						window.nullUtil.features.keystrokes.changeSize(value)
					}
				},
				info: 'Changes the size of the keystrokes.'
			},
			keystrokes_x: {
				name: 'Keystrokes X Off Set',
				id: 'keystrokes_x',
				type: 'slider',
				min: 0,
				max: 10,
				step: 0.1,
				value: 2,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					if(value && document.getElementById('keystrokes') != null) {
						window.nullUtil.features.keystrokes.XoffSet(value)
					}
				},
				info: 'Changes the position of the keystrokes.'
			},
			keystrokes_y: {
				name: 'Keystrokes Y Off Set',
				id: 'keystrokes_y',
				type: 'slider',
				min: 0,
				max: 10,
				step: 0.1,
				value: 1,
				html: function() {
					return window.nullUtil.genCSettingsHTML(this)
				},
				set: value => {
					if(value && document.getElementById('keystrokes') != null){
						window.nullUtil.features.keystrokes.YoffSet(value)
					}
				},
				info: 'Changes the position of the keystrokes.'
			}
		}
	}
}