const clientID = 'BKEAKNSWEY3HG45E0YE3FXFC0C0H3CNY1V4URMRJW0M1PLEK';
const clientSecret = 'ED3I2U5UNBVGKAD3GDQ2GEUUP3G4AP1SHHPQ5ZGCUOYQVLIM';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// APIXU Info
const apiKey = 'aa16bf1b5b38405baf772045183011';
const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=';



// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDivs = [$("#weather1"), $("#weather2"), $("#weather3"), $("#weather4"), $("#weather5")];
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// AJAX functions
async function getVenues() {
    const city = $input.val();
    const urlToFetch = url + city + '?limit=10&client_id=' +
    clientID + '&client_secret=' + clientSecret + '&v=20181130';

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            console.log(response);
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            let venues = jsonResponse.response.groups[0].items.map(item => item.venue);
            console.log(venues);
            return venues;
        }
        else {
            throw new Error('Request failed!');
        }
    } catch (error) {
        console.log(error);
    }
};

async function getForecast() {
    const urlToFetch = forecastUrl + apiKey + '&q=' + $input.val() + '&days=4&hours=11';

    try {
        let response = await fetch(urlToFetch);
        if (response.ok) {
            let jsonResponse = await response.json();
            // console.log(jsonResponse);
            let days = jsonResponse.forecast.forecastday;
            return days;
        }
    } catch(error) {
        console.log(error);
    }
}

// Render functions
function renderVenues(venues) {
    $venueDivs.forEach(($venue, index) => {
        // console.log('This is the venue ' + $venue);
        // console.log('This is the index ' + index);
        const venue = venues[index];
        const venueIcon = venue.categories[0].icon;
        const venueImgSrc = venueIcon.prefix + 'bg_64' + venueIcon.suffix;
        let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
        $venue.append(venueContent);
        });
        $destination.append(`<h2>${venues[0].location.city}</h2>`);


    //     let venueContent = 
    //         '<h2>' + venues[index].name + '</h2>' +
    //         '<img class="venueimage" src="' + imgPrefix + venues[index].photos.groups[0].items[0].suffix +
    //         '"/>' + 
    //         '<h3>Address:</h3>' + 
    //         '<p>' + venues[index].location.address + '</p>' +
    //         '<p>' + venues[index].location.city + '</p>' +
    //         '<p>' + venues[index].location.country + '</p>' +
    //         // '<h3>Category:</h3>' + 
    //         // '<p>' + venues[index].categories[0].name + '</p>';
    //     $venue.append(venueContent);
    // });
    // $destination.append('<h2>' + venues[0].location.city + '</h2>');
}

function renderForecast(days) {
    $weatherDivs.forEach(($day, index) => {
      let weatherContent =
        '<h2> High: ' + days[index].day.maxtemp_f + ' F / ' + days[index].day.maxtemp_c + ' C </h2>' +
        '<h2> Low: ' + days[index].day.mintemp_f + ' F / ' + days[index].day.mintemp_c + 'C </h2>' +
        '<img src="http://' + days[index].day.condition.icon +
            '" class="weathericon" />' +
        '<h2>' + weekDays[(new Date(days[index].date)).getDay()] + '</h2>';
      $day.append(weatherContent);
    });
}

function executeSearch() {
    $venueDivs.forEach(venue => venue.empty());
    $weatherDivs.forEach(day => day.empty());
    $destination.empty();
    $container.css("visibility", "visible");
    getVenues().then(venues => renderVenues(venues));
    getForecast().then(forecast => renderForecast(forecast));
    return false;
}

$submit.click(executeSearch);