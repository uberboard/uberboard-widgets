
let config

function init(widgetConfig) {
    config = widgetConfig
}

function render(callback) {

    const now = new Date()
    callback({
        text: `${now.toLocaleTimeString('de', {timeZone: config.timeZone})}`
    })
}

module.exports = {
    init: init,
    default: render
}