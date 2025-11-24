//To make sure DOM is loaded before any JS tried to run
document.addEventListener('DOMContentLoaded', () => {
    
    //Setting up hooks
    const searchButton = $('#search-button');
    const cityInput = $('#city-input');
    const apiKey = 'e26922b5bf8ae6d46c0de5695047bfd2';
    const url = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={apiKey}'


    
    //Event listeners
    searchButton.on('click', () => {
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');
    })
});