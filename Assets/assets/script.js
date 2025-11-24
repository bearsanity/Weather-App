//To make sure DOM is loaded before any JS tried to run
document.addEventListener('DOMContentLoaded', () => {
    
    //Setting up hooks
    const searchButton = $('#search-button');
    const cityInput = $('#city-input');
    
    //APIs
    const apiKey = 'e26922b5bf8ae6d46c0de5695047bfd2';
    //const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`; -> Moved inside function because the city changes with every search


    //Functions
    //To be called in getCoordinates to get weather once coordinates have been found
    async function getWeather(latitude, longitude) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

        const response = await fetch(weatherUrl);
        const data = await response.json();

        console.log('Weather data:', data);
    }
    
    //Gets coordinates tthen plugs them into get weather function to get weather
    async function getCoordinates(city){
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

        const response = await fetch(geoUrl);
        const data = await response.json();
        //console.log to see that it's working
        console.log('Data:', data);
        
        //limit = 1 in the api means only 1 result is returned, but it always returns an array so data[0] is neccesary
        const latitude = data[0].lat;
        const longitude = data[0].lon;

        console.log('Lat:', latitude);
        console.log('Long:', longitude);

        const weather = getWeather(latitude, longitude);
        console.log('weather:', weather);
    }

    //Event listeners
    searchButton.on('click', () => {
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');

        getCoordinates(city);
    })
});