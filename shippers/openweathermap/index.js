const https = require("https");

function render(callback, widgetConfig) {

    const config = widgetConfig.openweathermap

    https.get(config.url, (resp) => {
        let data = ''

        const { statusCode} = resp
        let error
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        }
        if (error) {
            console.log(error.message)
            // Consume response data to free up memory
            resp.resume();
            return;
        }

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            const weather = JSON.parse(data)
            console.log("Weather data retrieved")
            callback({
                temperature: Math.round(weather.main.temp),
                icon: weather.weather[0].icon,
                description: weather.weather[0].description
            })
        });
    })
}

module.exports = {
    default: render
}