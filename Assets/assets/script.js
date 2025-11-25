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

        try { //Let's you attempt code that might fail without crashing the entire script. 
            const response = await fetch(weatherUrl);
            if (!response.ok) {
                throw new Error('Invalid response from server');
            }
            const data = await response.json();
            console.log('Weather data:', data);
            renderCurrentWeather(data);
            renderFiveDayForecast(data);
        
        } catch(err) {
            alert('There was an error finding the weather.');
            console.error(err);
        };


        
    };
    
    //Creates the card for current weather
    function renderCurrentWeather(weatherInfo) {
        const container = $('#current-weather');
        container.empty(); //To clear out old content if nto already empty
        
        const current = weatherInfo.list[0]; //cleaner than using weatherInfo.list[0] over and over
        
        const city = weatherInfo.city.name;
        const temp = (current.main.temp).toFixed(1);
        const humidity = (current.main.humidity).toFixed(0);
        const wind = (current.wind.speed * 3.6).toFixed(2);//to change it to km/h
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
        const windEl = $('<p>').text(`Wind speed: ${wind} km\u002Fh`);

        //Append the card
        container.append(
            header,
            img,
            tempEl,
            humidityEl,
            windEl
        )

    }
   
    //same logic as the current weather but with a loop through indices to create a card for each day
    function renderFiveDayForecast(weatherInfo) {
        const container = $('#five-day-forecast');
        container.empty(); // clear old forecast cards

        // These indices give roughly noon for each of the next 5 days
        const indices = [7, 15, 23, 31, 39];

        indices.forEach(i => {
            const dayData = weatherInfo.list[i];

            // Extract data just like current weather
            const date = new Date(dayData.dt * 1000).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });

            const temp = dayData.main.temp.toFixed(1);
            const humidity = dayData.main.humidity.toFixed(0);
            const wind = (dayData.wind.speed * 3.6).toFixed(2);
            const icon = dayData.weather[0].icon;

            // Create card
            const card = $('<div>').addClass('forecast-card');

            // Build DOM elements
            const header = $('<h3>').text(date);

            const img = $('<img>')
                .attr('src', `https://openweathermap.org/img/wn/${icon}@2x.png`)
                .attr('alt', 'Weather icon');

            const tempEl = $('<p>').text(`Temp: ${temp}\u00B0C`);
            const windEl = $('<p>').text(`Wind: ${wind} km\u002Fh`);
            const humidityEl = $('<p>').text(`Humidity: ${humidity}\u0025`);

            // Append to card - Done this way because theres 5 instead of 1 card this time
            card.append(header, 
                img, 
                tempEl,  
                humidityEl,
                windEl);

            // Append card to container
            container.append(card);
        });
    }

    //Saving the search to localstorage
    function saveCityToHistory(city) {
        let history = JSON.parse(localStorage.getItem('history')) || []; // [] is incase nothing exists yet

        //To prevent duplicates | .some() checks if any element in the array matches the given condition
        const normalizedCity = city.toLowerCase();
            if (!history.some(c => c.toLowerCase() === normalizedCity)) {
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
        }
    };

    //To create the history buttons | Same logic as the cards for current weather and 5 day weather
    function renderHistoryButtons() {
        const container = $('#search-history');
        container.empty();

        const history = JSON.parse(localStorage.getItem('history')) || [];

        history.forEach(city => {
            const btn = $('<button>')
                .addClass('history-btn')
                .text(city)
                .on('click', () => {
                    // Clicking this button should load the weather again
                    getCoordinates(city);
                });

            container.append(btn);
    });
    };


    //====================
    //High level functions
    //====================

    //Gets coordinates then plugs them into get weather function to get weather
    async function getCoordinates(city){
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

        const response = await fetch(geoUrl);
        const data = await response.json();
        console.log('Data:', data); //console.log to see that it's working
        
        //If the api returns bad data or no data it will end the process and throw an alert
        if (!data || data.length === 0) {
            alert('City not found. Please try searching again.');
            return;
        }
        
        //limit = 1 in the api means only 1 result is returned, but it always returns an array so data[0] is necessary
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        console.log('Lat:', latitude);
        console.log('Long:', longitude);

        getWeather(latitude, longitude); //getWeather already ends with a console.log so no need to call it again to check if it works
    }

    //So we load the history buttons from previous sessions right away on page load
    renderHistoryButtons();

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
        saveCityToHistory(city);
        renderHistoryButtons();
        getCoordinates(city);
    });

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
        saveCityToHistory(city);
        renderHistoryButtons();
        getCoordinates(city);
    });
    //For the collapsable search history menu on mobile only
    $('#history-toggle').on('click', () => {
        $('#search-history').toggleClass('active');
    });
});