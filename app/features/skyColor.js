let game
let color
let init = false

module.exports = {
    init(value) {
        init = true
        color = value
        Object.defineProperty(Object.prototype, 'skyCol', {
            enumerable: false,
            get() {
                return color
            }
        })
        Object.defineProperty(Object.prototype, 'renderer', {
            enumerable: false,
            get() {
                game = this
                return this._renderer
            },
            set(val) {
                this._renderer = val
            }
        })
    },
    changeColor(value) {
        if(init) {
            color = value 
            game.renderer.setClearColor(color)
        }
    }
    
}
/*
        ChangeSkyColor(value) {
            Object.defineProperty(Object.prototype, 'skyCol', {
                value: value
            })
        }
*/