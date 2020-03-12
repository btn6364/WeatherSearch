const request = require("request");
const forecast = (latitude, longtitude, callback) => {
    const darksky = "https://api.darksky.net/forecast/24336ec2fd98e9ceba713b2d6e0e5e3e/" + encodeURIComponent(latitude) + "," + encodeURIComponent(longtitude) + "?units=us";

    request({ url: darksky, json: true }, (error, response) => {
        if (error){
            callback("Unable to connect to weather service!", undefined);
        } else if (response.body.error) {
            callback("Unable to find location!", undefined);
        } else {
            const currentData = response.body.currently;
            const tempt = currentData.temperature;
            const precipProbability = currentData.precipProbability;
            const out = response.body.daily.data[0].summary  + "\n" 
                        + "It is currently " + tempt + " degrees out." + "\n" 
                        + "There is a " + precipProbability * 100 + "% chance of rain." + "\n"
                        + "Highest temperature: " + response.body.daily.data[0].temperatureHigh + " - " + "Lowest temperature: " + response.body.daily.data[0].temperatureLow + "\n"
                        + "Wind speed: " + response.body.daily.data[0].windSpeed + "\n"
                        + "Humidity: " + response.body.daily.data[0].humidity
            callback(undefined, out);
        };
    });
};


module.exports = forecast;