"use strict";

//To make sure DOM is loaded before any JS tries to run
document.addEventListener('DOMContentLoaded', () => {
    
    //Setting up hooks
    const searchButton = $('#search-button');
    const cityInput = $('#city-input');
    
    //APIs - URLs aren't called here, this is just to have them in one place
    const apiKey = 'e26922b5bf8ae6d46c0de5695047bfd2';
    //const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    //const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;


    //================
    //Helper Functions
    //================
    
    //To be called in getCoordinates to get weather once coordinates have been found
    async function getWeather(latitude, longitude) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        console.log('Weather data:', data);
        renderCurrentWeather(data);
    }
    
    //Creates the card for current weather
    function renderCurrentWeather(weatherInfo) {
        const container = $('#current-weather');
        container.empty(); //To clear out old content if nto already empty
        
        const current = weatherInfo.list[0] //cleaner than using weatherInfo.list[0] over and over
        
        const city = weatherInfo.city.name;
        const temp = (current.main.temp).toFixed(1);
        const humidity = (current.main.humidity).toFixed(0);
        const wind = (current.wind.speed).toFixed(2);
        const icon = current.weather[0].icon; //gives the icon code
       
        //Javascript Date object to convert the dt from the api
        const date = new Date(current.dt * 1000).toLocaleDateString("en-US", {
            month: "short", //Shows abbreviation for the month name so it can be quickly understood anywhere on the planet in cases where day is <13
            day: "numeric",
            year: "numeric"
        });

        //Creating DOM elements
        const header = $('<h2>').text(`${city} - ${date}`);
        const img = $('<img>')
            .attr('src', `https://openweathermap.org/img/wn/${icon}@2x.png`) //as per the docs, this will take in the icon code (decalred as icon earlier) and display the correct icon
            .attr('alt', 'Icon displaying the current weather');
        const tempEl = $('<p>').text(`Temperature: ${temp}\u00B0C`);
        const humidityEl = $('<p>').text(`Humidity: ${humidity}\u0025`);
        const windEl = $('<p>').text(`Wind speed: ${wind}m\u002Fs`);

        container.append(
            header,
            img,
            tempEl,
            humidityEl,
            windEl
        )

    }
    
    //====================
    //High level functions
    //====================

    //Gets coordinates then plugs them into get weather function to get weather
    async function getCoordinates(city){
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

        const response = await fetch(geoUrl);
        const data = await response.json();
        console.log('Data:', data); //console.log to see that it's working
        
        //limit = 1 in the api means only 1 result is returned, but it always returns an array so data[0] is necessary
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        console.log('Lat:', latitude);
        console.log('Long:', longitude);

        getWeather(latitude, longitude); //getWeather already ends with a console.log
    }



    //===============
    //Event listeners
    //===============

    searchButton.on('click', () => {
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');

        if (city === '') {
            return; //Prevents searching if search is empty
        }

        getCoordinates(city);
    })

     cityInput.on('keypress', (event) => {
        if (event.key !== "Enter") {
            return; //Prevents activation from other keys
        }
        
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');

        if (city === '') {
            return; //Prevents searching if search is empty
        }

        getCoordinates(city);
    })
});