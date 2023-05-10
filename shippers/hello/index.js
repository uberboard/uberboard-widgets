
let model


// run only once
function init(widgetConfig) {
    model = {
        text: widgetConfig.defaultText
    }
}

function onData(data) {
    model.text = data.text
}

function render(callback) {

    callback(model)
}

module.exports = {
    init: init,
    default: render,
    onData: onData
}

