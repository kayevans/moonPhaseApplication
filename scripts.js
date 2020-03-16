// namespace object
const moonPhaseApp = {};

//my  API key
moonPhaseApp.apiKey = "790454acc4803e3d0fe99f75a70e4162";

// array of objects for pictures and names
moonPhaseApp.moonInfo = [
    {
        name: "New Moon",
        image: "./assets/noun_New Moon_743339.png",
    },
    {
        name: "Waxing Crescent",
        image: "./assets/noun_waxcrescent_743350.png",
    },
    {
        name: "First Quarter Moon",
        image: "./assets/noun_firstquarter_743368.png",
    },
    {
        name: "Waxing Gibbous",
        image: "./assets/noun_waxgibbous_743345.png",
    },
    {
        name: "Full Moon",
        image: "./assets/noun_Full Moon_743323.png",
    },
    {
        name: "Waning Gibbous",
        image: "./assets/noun_wangibbous_743357.png",
    },
    {
        name: "Last Quarter Moon",
        image: "./assets/noun_lastquarter_743321.png",
    },
    {
        name: "Waning Crescent",
        image: "./assets/noun_wanCrescent_743359.png",
    },
];

// function to convert array of data to information to display
// want an array of objects that have properties, index, name, picture
// takes in an array
moonPhaseApp.convertToInfo = function(array){

    // make a variable to hold index as it loops
    let dayIndex = 0;
    
    // maps through and returns an array of the information for each day
    const arrayOfInfo = array.map(function(day){

        // count up as we loop
        dayIndex++;

        // make variable for the moonphase value
        let dailyMoonPhase = day.moonPhase;

        // make empty variable for the name
        let moonPhaseName;

        // make empty variable for the picture
        let moonPhaseImage;

        // make empty object for the information
        let moonPhaseInformation = {};

        //if the moon phase is certain number, display certain name and image
        // information found on internet
        if(dailyMoonPhase <= 0.02 && dailyMoonPhase >= 0){
                moonPhaseName = moonPhaseApp.moonInfo[0].name;
                moonPhaseImage = moonPhaseApp.moonInfo[0].image;
        } else if(dailyMoonPhase < 0.23 && dailyMoonPhase > 0.02){
                moonPhaseName = moonPhaseApp.moonInfo[1].name;
                moonPhaseImage = moonPhaseApp.moonInfo[1].image;
        } else if(dailyMoonPhase <= 0.27 && dailyMoonPhase >= 0.23){
                moonPhaseName = moonPhaseApp.moonInfo[2].name;
                moonPhaseImage = moonPhaseApp.moonInfo[2].image;
        } else if(dailyMoonPhase < 0.48 && dailyMoonPhase > 0.27){
                moonPhaseName = moonPhaseApp.moonInfo[3].name;
                moonPhaseImage = moonPhaseApp.moonInfo[3].image;
        } else if(dailyMoonPhase <= 0.52 && dailyMoonPhase >= 0.48){
                moonPhaseName = moonPhaseApp.moonInfo[4].name;
                moonPhaseImage = moonPhaseApp.moonInfo[4].image;
        } else if(dailyMoonPhase < 0.73 && dailyMoonPhase > 0.52){
                moonPhaseName = moonPhaseApp.moonInfo[5].name;
                moonPhaseImage = moonPhaseApp.moonInfo[5].image;
        } else if(dailyMoonPhase <= 0.77 && dailyMoonPhase >= 0.73){
                moonPhaseName = moonPhaseApp.moonInfo[6].name;
                moonPhaseImage = moonPhaseApp.moonInfo[6].image;
        } else if (dailyMoonPhase <= 1.00 && dailyMoonPhase > 0.77){
                moonPhaseName = moonPhaseApp.moonInfo[7].name;
                moonPhaseImage = moonPhaseApp.moonInfo[7].image;
        };

        // add properties to the object
        moonPhaseInformation.index = dayIndex;
        moonPhaseInformation.name = moonPhaseName;
        moonPhaseInformation.image = moonPhaseImage;

        // store the object
        return moonPhaseInformation;
    });

    // return the array to store it
    return arrayOfInfo;
};

// display names and images on page
// takes in array
moonPhaseApp.displayMoonPhase = function(array){
    //for each day, display the image and icon on page
    array.forEach(function(day){
        //make variables
        //name variable
        let displayName = day.name;
        //picture variable
        let displayImage = day.image;

        // put the first day (current day) in different place
        if(day.index === 1){
            // write the html to put in the page
            const htmlToAppend = `
                <h3>Today</h3>
                <div class="imageContainer">
                        <img src="${displayImage}" alt="${displayName}" />
                </div>
                <h2>${displayName}</h2>
            `;

            // // append the html
            moonPhaseApp.todaysPhaseResults.append(htmlToAppend);

            //put the others into a list
        } else{
            // write the html to put in the page
            const htmlToAppend = `
                <li>
                    <div class="imageContainer">
                        <img src="${displayImage}" alt="${displayName}" />
                    </div>
                    <h4>${displayName}</h4>
                </li>
            `;

            // // append the html
            moonPhaseApp.weeksPhaseResults.append(htmlToAppend);
        }
    });
};


// get information/moonphase from the API
moonPhaseApp.getMoonPhase = function(coordinate){

    $.ajax({
        url: "http://proxy.hackeryou.com",
        method: "GET",
        dataType: "json",
        data: {
            reqUrl: `https://api.darksky.net/forecast/${moonPhaseApp.apiKey}/${coordinate}`,
            params: {
                method: 'GET',
                dataType: 'json',
                // reduces data
                exclude: 'hourly, flags, minutely, currently',
            }
        }
    }).then(function(response){
        //make variable to hold weekly data
        const weeklyMoonPhase = response.daily.data;

        // convert the array of data to information to display on page
        const weeklyArray = moonPhaseApp.convertToInfo(weeklyMoonPhase);
        
        //display the information
        moonPhaseApp.displayMoonPhase(weeklyArray);

        console.log(weeklyMoonPhase);
    });

};


// initializing function
moonPhaseApp.init = function() {

    // cache selectors
    moonPhaseApp.manualForm = $('.manualForm');
    moonPhaseApp.buttonForm = $('.buttonForm');
    moonPhaseApp.chooseForm = $('.chooseMethod');
    moonPhaseApp.todaysPhaseResults = $('.displayResult');
    moonPhaseApp.weeksPhaseResults = $('.weeklyResult');
    moonPhaseApp.resultsSection = $('section.results');



    // originally hide the two forms
    moonPhaseApp.manualForm.hide();
    moonPhaseApp.buttonForm.hide();

    // when the first form submitted, show the chosen form
    moonPhaseApp.chooseForm.on('submit', function(event){
        // prevent auto reload
        event.preventDefault();

        // cache selector in here
        moonPhaseApp.choosenMethod = $('.chooseMethod input:radio:checked');

        // if the value is coordinate
        if(moonPhaseApp.choosenMethod.val() === 'coordinate'){
            // show the manual form
            moonPhaseApp.manualForm.show('slow');
            // hide the choose method form
            moonPhaseApp.chooseForm.hide('slow');

            // if the value is city
        } else {
            // show the button form
            moonPhaseApp.buttonForm.show('slow');
            // hide the choose method form
            moonPhaseApp.chooseForm.hide('slow');
        }
    });
    
    // when the manual form is submitted, get the info
    // convert input from text input into coordinate
    moonPhaseApp.manualForm.on('submit', function(event){

        //prevent auto reload
        event.preventDefault();
        
        // cache selectors in here
        moonPhaseApp.latitudeUserInput = $('#latitudeInput');
        moonPhaseApp.longitudeUserInput = $('#longitudeInput');

        //empty container
        moonPhaseApp.todaysPhaseResults.empty();
        moonPhaseApp.weeksPhaseResults.empty();

        // capture the latitude input into a variable
        const latitudeInput = moonPhaseApp.latitudeUserInput.val();

        // capture the latitude input into a variable
        const longitudeInput = moonPhaseApp.longitudeUserInput.val();

        //make new variable for coordinate
        const coordinate = `${latitudeInput},${longitudeInput}`;

        //pass this coordinate to the API to get information
        moonPhaseApp.getMoonPhase(coordinate);

        // clear values after
        moonPhaseApp.latitudeUserInput.val('');
        moonPhaseApp.longitudeUserInput.val('');

        // only show results when form is submitted
        moonPhaseApp.resultsSection.addClass("show");

        //go to results section
        $('html, body').animate(
            {
                scrollTop: $('.results').offset().top,
            }, 
            'slow',
        );
    });

    //when the selected choice form is submitted, get the info
    moonPhaseApp.buttonForm.on('submit', function(event){

        //prevent auto reload
        event.preventDefault();

        // cache selectors in here
        moonPhaseApp.choosenCity = $('.buttonForm input:radio:checked');

        //empty container
        moonPhaseApp.todaysPhaseResults.empty();
        moonPhaseApp.weeksPhaseResults.empty();

        //capture the values
        const coordinate = moonPhaseApp.choosenCity.val();
    
        //pass this coordinate to the API to get information
        moonPhaseApp.getMoonPhase(coordinate);

        // only show results when form is submitted
        moonPhaseApp.resultsSection.addClass("show");

        //go to results section
        $('html, body').animate(
            {
                scrollTop: $('.results').offset().top,
            }, 
            'slow',
        );
    });
};

// document ready
$(function(){

    //call initializing function
    moonPhaseApp.init();
});