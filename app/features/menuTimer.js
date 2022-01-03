var timerVal, timerObserver
document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(Object.assign(document.createElement('style'), {
        innerHTML: "#uiBase.onMenu #null_menu_timer {align-items: center; position: absolute; top: calc(50% + 60px); left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.5); font-size: 34px;}"
    }))
    timerVal = document.getElementById('timerVal')
    if (timerVal) {
        const menuTimer = Object.assign(document.createElement('span'), {id: 'null_menu_timer'})
        document.getElementById('menuHider')?.appendChild(menuTimer)
        timerObserver = new MutationObserver(() => {
			menuTimer.innerText = timerVal.innerText
		})
    }
})
function toggle(value) {
    let menuTimer = document.getElementById('null_menu_timer')
	if(menuTimer) {
		menuTimer.style.display = value ? 'flex' : 'none'
	}
	if(value) {
	    timerObserver.observe(timerVal, {childList: true})
	} else {
	    timerObserver.disconnect()
    }
}
module.exports = {toggle}
