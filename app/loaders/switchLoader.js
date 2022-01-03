'use strict'

let yargs = require('yargs')

let switchLoader = function(app, config){
    if (!config.get('acceleratedCanvas', true)) {app.commandLine.appendSwitch('disable-accelerated-2d-canvas', 'true')}
    if (config.get('disableFrameRateLimit', true)) {app.commandLine.appendSwitch('disable-frame-rate-limit');app.commandLine.appendSwitch('disable-gpu-vsync')}
    if (config.get('in_process_gpu', true)) {app.commandLine.appendSwitch('in-process-gpu')}
    if (config.get('enable_pointer_lock_options', false)) {app.commandLine.appendSwitch('enable-pointer-lock-options')}
    let angleBackend = config.get('angle_backend', 'default')
    let colorProfile = config.get('color_profile', 'default')
    if (angleBackend != 'default') {app.commandLine.appendSwitch('use-angle', angleBackend)}
    if (colorProfile != 'default') {app.commandLine.appendSwitch('force-color-profile', colorProfile)}
    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required') //allows to play the splash audio
    if(config.get('high_performance_gpu',)) {
	    app.commandLine.appendSwitch('force_high_performance_gpu')
	    app.commandLine.appendSwitch('force-high-performance-gpu') //second try
    }
    app.commandLine.appendSwitch('ignore-gpu-blacklist')
    app.commandLine.appendSwitch('disable-breakpad') //disable crash report
    app.commandLine.appendSwitch('disable-print-preview') //disable print preview
    app.commandLine.appendSwitch('max-active-webgl-contexts', 100)
    app.commandLine.appendSwitch('enable-quic')
    app.commandLine.appendSwitch('high-dpi-support', 1)
    app.commandLine.appendSwitch('disable-2d-canvas-clip-aa')
    app.commandLine.appendSwitch('enable-highres-timer') //use highresolution timer --> less input delay (mostly)
    app.commandLine.appendSwitch('disable-metrics') 
    app.commandLine.appendSwitch('disable-metrics-repo')
    app.commandLine.appendSwitch('disable-bundled-ppapi-flash')
    app.commandLine.appendSwitch('disable-logging')
    app.commandLine.appendSwitch('enable-javascript-harmony')
    app.commandLine.appendSwitch('enable-future-v8-vm-features')
    app.commandLine.appendSwitch('disable-low-end-device-mode')
    app.commandLine.appendSwitch('enable-webgl2-compute-context')
    app.commandLine.appendSwitch('disable-hang-monitor')
    app.commandLine.appendSwitch('renderer-process-limit', 100)
    app.commandLine.appendSwitch('disable-web-security')
    app.commandLine.appendSwitch('webrtc-max-cpu-consumption-percentage=100')
    app.commandLine.appendSwitch('enable-zero-copy')
    app.commandLine.appendSwitch('no-pings')
    app.commandLine.appendSwitch('no-proxy-server')
    yargs.parse(config.get('chromium_flags', ''), (err, argv) => Object.entries(argv).slice(1, -1).forEach(entry => app.commandLine.appendSwitch(entry[0], entry[1])))
    console.log('DEBUG:', 'Switches loaded.')
}

module.exports = switchLoader