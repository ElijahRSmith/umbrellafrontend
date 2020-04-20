export default chanceOfAnyRain;

const proxyURL = 'http://localhost:3001'


async function chanceOfAnyRain(places) {
    let precip = 0;
    for (let i = 0; i < places.length; i++) {
        precip += await chanceOfRain(places[i]);
    }
    return Math.floor(precip / places.length);
}

async function chanceOfRain(place) {
    let coords = await getLocation(place.city, place.state)

    if (coords === "Error L") {
        return -1;
    }
    return await getWeather(coords, fmtTime(place.from), fmtTime(place.to)).catch((rej) => {return -2});
}

function getWeather(coords, from, to) {
    return new Promise((resolve, reject) => {
        fetch(`${proxyURL}/weather/${coords.lat}-${coords.long}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                let cforecasts = selectForecasts(data, from, to);
                let chance = averagePrecip(cforecasts);
                resolve(chance);
            })
            .catch((err) => {
                console.log(err)
                reject("Error C");
            });
    })
}

function getLocation(city, state) {
    let htmlCity = city.replace(" ", "+");
    let htmlState = state.replace(" ", "+");

    return new Promise((resolve, reject) => {
        fetch(`${proxyURL}/location/${htmlCity}-${htmlState}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data)
                let lat = data.results[0].geometry.bounds.northeast.lat;
                let long = data.results[0].geometry.bounds.northeast.lng;
                resolve({ lat: lat, long: long });
            })
            .catch((err) => {
                console.log(err)
                resolve("Error L")
            });
    })
}

function selectForecasts(data, from, to) {

    let chosenForecasts = [];
    let hour;
    
    for (let i = 0; i < data.forecasts.length; i++){
        hour = fixZone(parseInt(data.forecasts[i].date.slice(11, 13)));
        if (from <= hour && hour < to) {
            chosenForecasts.push(data.forecasts[i])
        }
    }
    console.log(chosenForecasts);
    return chosenForecasts;
}

function fixZone(value) { // Weather server timezone is 4 hours ahead.
    if (value - 4 < 0) {
        return value + 20;
    } else {
        return value - 4;
    }
}

function averagePrecip(forecasts) {
    let total = 0;
    for (let i = 0; i < forecasts.length; i++) {
        total += forecasts[i].precipitationProbability;
    }

    return total / forecasts.length;
}

function fmtTime(value) {
    let hour = value.slice(0,2);
    return parseInt(hour);
}