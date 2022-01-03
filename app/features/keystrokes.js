/*
  Keystrokes designed and programmed by CrafterL for krunker.io
  v.0.0.1
*/

var keystrokes_style,keystrokes,key_w,key_a,key_s,key_d
var size = 1
var x
var y

document.addEventListener('DOMContentLoaded', () => {init()})

function init() {
    keystrokes_style = document.createElement('style')
    keystrokes_style.id = 'keystrokes_style'
    document.body.appendChild(keystrokes_style)
    document.addEventListener('keydown', (key) => {
        if(document.getElementById('keystrokes')!=null){
            if(key.key === 'w') {key_w.style.backgroundColor = 'rgba(150,150,150, 0.3)'}
            if(key.key === 'a') {key_a.style.backgroundColor = 'rgba(150,150,150, 0.3)'}
            if(key.key === 's') {key_s.style.backgroundColor = 'rgba(150,150,150, 0.3)'}
            if(key.key === 'd') {key_d.style.backgroundColor = 'rgba(150,150,150, 0.3)'}
        }
    })
    document.addEventListener('keyup', (key) => {
        if(document.getElementById('keystrokes')!=null) {
            if(key.key === 'w') {key_w.style.backgroundColor = 'rgba(0,0,0, 0.3)'}
            if(key.key === 'a') {key_a.style.backgroundColor = 'rgba(0,0,0, 0.3)'}
            if(key.key === 's') {key_s.style.backgroundColor = 'rgba(0,0,0, 0.3)'}
            if(key.key === 'd') {key_d.style.backgroundColor = 'rgba(0,0,0, 0.3)'}
        }
    })
}
function create(val,val2,val3) {
    size = val
    x = val2
    y = val3
    keystrokes_style.innerHTML = 
    `
    #keystrokes {
        height: ${80*size}px;
        width: ${120*size}px;
        left: ${x*10}%;
        bottom: ${y*10}%;
        position: absolute;
    }
    .keystrokes_key {
        background-color: rgba(0,0,0, 0.3);
        height: ${49*size}%;
        width: ${32.5*size}%;
        position: absolute;
        line-height: 400%;
        text-align: center;
        font-size: ${20*size}px;
        color: white;
    }
    #key_w {
        margin-left: ${33.5*size}%;
    }
    #key_a {
        margin-top: ${33.5*size}%;
    }
    #key_s {
        margin-top: ${33.5*size}%;
        margin-left: ${33.5*size}%;
    }
    #key_d {
        margin-top: ${33.5*size}%;
        margin-left: ${67*size}%;
    }`
    keystrokes = document.createElement('div')
    keystrokes.id = 'keystrokes'
    key_w = document.createElement('div')
    key_w.id = 'key_w'
    key_w.className = 'keystrokes_key'
    key_w.innerHTML = 'W'
    key_a = document.createElement('div')
    key_a.id = 'key_a'
    key_a.className = 'keystrokes_key'
    key_a.innerHTML = 'A'
    key_s = document.createElement('div')
    key_s.id = 'key_s'
    key_s.className = 'keystrokes_key'
    key_s.innerHTML = 'S'
    key_d = document.createElement('div')
    key_d.id = 'key_d'
    key_d.className = 'keystrokes_key'
    key_d.innerHTML = 'D'
    keystrokes.append(key_w,key_a,key_s,key_d)
    document.getElementById('inGameUI').appendChild(keystrokes)
}
function changeSize(val) {
    size = val
    keystrokes.style.height = `${80*size}px`
    keystrokes.style.width = `${120*size}px`
    key_w.style.fontSize = `${20*size}px`
    key_a.style.fontSize = `${20*size}px`
    key_s.style.fontSize = `${20*size}px`
    key_d.style.fontSize = `${20*size}px`
    changePosition(x,y)
}
function changePosition(val,val2) {
    x = val
    y = val2
    if (x > 5) {keystrokes.style.left = `${x*10-((120*size/window.innerWidth*100)*((x-5)/5))}%`}
    else {keystrokes.style.left = `${(x*10)}%`}
    if(y > 5) {keystrokes.style.bottom = `${x*10-((80*size/window.innerHeight*100)*((x-5)/5))}%`}
    else {keystrokes.style.bottom = `${(y*10)}%`}
}
function XoffSet(val) {
    x = val
    changePosition(x,y)
}
function YoffSet(val) {
    y = val
    changePosition(x,y)
}
function remove() {
    if(keystrokes) {
        keystrokes.remove()
        keystrokes_style.innerHTML = ''
    }
}
module.exports = {create,changeSize,changePosition,XoffSet,YoffSet,remove}