const fromCity = document.getElementById("location");
const form = document.querySelector("form");

const display = document.getElementById("display");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("form submitted");
    getWeather(fromCity.value);
    while(display.firstChild) {
        display.removeChild(display.firstChild);
    }
})

function getWeather(city) {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=6DY96YBT25CP5L8EXLV2NM4Z5`, {
        mode: 'cors'
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            console.log(response);
            processWeather(response)
        })
        .catch(function(err) {
            console.log(err);
        })
}

function processWeather(response){
    const currObj = {};

    currObj.currentTemp = response.currentConditions.temp;
    currObj.currentConditions = response.currentConditions.conditions;
    currObj.currentWind = response.currentConditions.windspeed;

    console.log(currObj);

    const currentList = document.createElement('div');
    currentList.classList.add('day');

    display.appendChild(currentList);

    const currHeader = document.createElement('h1');
    const currDateItem = document.createElement('p');
    const currConditionsItem = document.createElement('p');
    const currWindItem = document.createElement('p');

    currHeader.textContent = "Right Now";
    currDateItem.textContent = `${currObj.currentTemp} Fahrenheit`;
    currConditionsItem.textContent = currObj.currentConditions;
    currWindItem.textContent = `Wind Speed: ${currObj.currentWind}`

    currentList.appendChild(currHeader);
    currentList.appendChild(currDateItem);
    currentList.appendChild(currConditionsItem);
    currentList.appendChild(currWindItem);
    getIcon(currObj.currentConditions, currentList);

    const daysObj = {};
    daysObj.days = response.days;
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for(const { datetime, temp, conditions, windspeed } of daysObj.days) {
        const dayList = document.createElement('div');
        display.appendChild(dayList);
        dayList.classList.add('day');

        const [year, month, day] = datetime.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const weekday = date.toLocaleDateString(undefined, { weekday: "long" });

        const dateItem = document.createElement('h1');
        dateItem.textContent = weekday;
        dayList.appendChild(dateItem);

        const tempItem = document.createElement('p');
        tempItem.textContent = `${temp} Fahrenheit`;
        dayList.appendChild(tempItem);

        const conditionItem = document.createElement('p');
        conditionItem.textContent = conditions;
        dayList.appendChild(conditionItem);

        const windItem = document.createElement('p');
        windItem.textContent = `Wind Speed: ${windspeed} mph`;
        dayList.appendChild(windItem);

        getIcon(conditions, dayList);
    }

    console.log(daysObj.days[0]);
}

function getIcon(conditions, list) {
    const icon = document.createElement('img');
    if(conditions.includes("Rain")) {
        icon.src = './assets/rain.svg';
    }
    else if(conditions.includes("Partially cloudy")) {
        icon.src = './assets/partcloudy.svg';
    }
    else if(conditions.includes("Overcast")) {
        icon.src = './assets/cloud.svg';
    }
    else if(conditions.includes("Clear")) {
        icon.src = './assets/sun.svg';
    }
    list.appendChild(icon);
}



