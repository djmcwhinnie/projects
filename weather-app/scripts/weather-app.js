// Global Variables
let checkMobile = window.matchMedia('screen and (max-width: 767px)');
let checkTablet = window.matchMedia('screen and (min-width: 768px) and (max-width: 1199px)');
let checkDesktop = window.matchMedia('screen and (min-width: 1200px)');
let appID = '[insert-key-here]';

// Weather Quotes
var quotes = [
    '"Red sky at night, shepherds delight. Red sky in morning, shepherds take warning."',
    '"The higher the clouds, the finer the weather."',
    '"Clear Moon, frost soon."',
    '"When clouds appear like towers, the Earth is refreshed by frequent showers."',
    '"Rainbow in the morning gives you fair warning."',
    '"Ring around the moon? Rain real soon."',
    '"Rain foretold, long last. Short notice, soon will pass."',
    '"There is no such thing as bad weather, just the wrong clothing."',
    '"Wherever you go, no matter what the weather, always bring your own sunshine."',
    '"Beautiful sunsets need cloudy Skies."',
];

// Weather Quote - Random
let randomQuote = Math.floor(Math.random() * quotes.length);
document.getElementById('description').innerHTML = quotes[randomQuote];

// Default Background Image
function defaultBackground() {
    if (checkMobile.matches) {
        document.getElementById('background-img').style.backgroundImage =
            'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/800x800/?earth")';
        console.log('this is a mobile screen');
    }

    if (checkTablet.matches) {
        document.getElementById('background-img').style.backgroundImage =
            'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1024x768/?earth")';
        console.log('this is a tablet screen');
    }

    if (checkDesktop.matches) {
        document.getElementById('background-img').style.backgroundImage =
            'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1400x1024/?earth")';
        console.log('this is a desktop screen');
    }
}
defaultBackground();

// Clear Input - on page load
window.onload = function () {
    document.getElementById('location').value = '';
};

// Current Weather - Geo
function geoFindUser() {
    const status = document.getElementById('status');

    function success(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        status.classList.toggle('hide');
        console.log('lat position:' + ' ' + lat);
        console.log('long position:' + ' ' + long);

        const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=metric&appid=' + appID;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                document.getElementById('weather').textContent = data.weather[0].main;
                document.getElementById('weather-icon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
                document.getElementById('weather-icon').classList.remove('hide');
                document.getElementById('description').textContent = data.weather[0].description;
                document.getElementById('name').textContent = data.name;
                document.getElementById('name').classList.remove('hide');
                document.getElementById('tempValue').textContent = Math.floor(data.main.temp);
                document.getElementById('temp').classList.remove('hide');
                console.log(data);

                let bkgndTerm = data.weather[0].main;

                // Weather Background Image
                if (checkMobile.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/800x800/?' + bkgndTerm + '")';
                    console.log('this is a mobile screen');
                }

                if (checkTablet.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1024x768/?' + bkgndTerm + '")';
                    console.log('this is a tablet screen');
                }

                if (checkDesktop.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1400x1024/?' + bkgndTerm + '")';
                    console.log('this is a desktop screen');
                }
            })
            .catch(console.error);
    }

    function error() {
        status.classList.toggle('hide');
        status.textContent = 'Unable to retrieve your location';
    }

    if (!navigator.geolocation) {
        status.classList.toggle('hide');
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.classList.toggle('hide');
        status.textContent = 'Locating';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
document.querySelector('#find-user').addEventListener('click', geoFindUser);

// Current Weather - Search
function locFindUser() {
    const search = document.getElementById('location');
    const status = document.getElementById('status');

    let searchTerm = search.value;

    if (!status.classList.contains('hide')) {
        status.classList.add('hide');
    }

    if (search.classList.contains('highlight')) {
        status.classList.remove('highlight');
    }

    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + searchTerm + ',uk&units=metric&appid=' + appID;

    const weatherPromise = fetch(url);
    weatherPromise
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (data.cod == 200) {
                document.getElementById('weather').textContent = data.weather[0].main;
                document.getElementById('weather-icon').src = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
                document.getElementById('weather-icon').classList.remove('hide');
                document.getElementById('description').textContent = data.weather[0].description;
                document.getElementById('name').textContent = data.name;
                document.getElementById('name').classList.remove('hide');
                document.getElementById('tempValue').textContent = Math.floor(data.main.temp);
                document.getElementById('temp').classList.remove('hide');

                let bkgndTerm = data.weather[0].main;

                // Weather Background Image
                if (checkMobile.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/800x800/?' + bkgndTerm + '")';
                    console.log('this is a mobile screen');
                }

                if (checkTablet.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1024x768/?' + bkgndTerm + '")';
                    console.log('this is a tablet screen');
                }

                if (checkDesktop.matches) {
                    document.getElementById('background-img').style.backgroundImage =
                        'linear-gradient(to right top, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3)), url("https://source.unsplash.com/1400x1024/?' + bkgndTerm + '")';
                    console.log('this is a desktop screen');
                }
            } else if (data.cod == '404' && searchTerm.length > 0) {
                // 404 Error After Search
                status.classList.remove('hide');
                status.textContent = `Sorry, ${data.message}. Please try again or use Geo Location.`;
            } else if (data.cod == '404' && searchTerm === '') {
                // Empty input error check
                status.classList.remove('hide');
                search.classList.toggle('highlight');
                status.textContent = 'Sorry, input field is blank. You need to enter a city or town name.';
            }
        })
        .catch(handleError);

    function handleError(err) {
        console.log(err);
        status.classList.remove('hide');
        status.textContent = 'Sorry, something went wrong. Please check the console for more details.';
    }
}

document.querySelector('#search-user').addEventListener('click', locFindUser);
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        locFindUser();
        console.log(event.key);
    }
});

// Footer Date
var footerDate = new Date();
document.getElementById('footer-date').innerHTML = footerDate.getFullYear();
