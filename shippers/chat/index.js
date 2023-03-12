
const messages = []

function onData(data) {

    if (messages.length >= 5) {
        messages.shift()
    }
    if (data?.author && data?.text) {
        messages.push(data)
    }
}

function render(callback) {

    callback({
        messages
    })
}

module.exports = {
    onData: onData,
    default: render
}

