const fromCity = document.getElementById("location");
const form = document.querySelector("form");

const display = document.getElementById("display");
let currObj = {};
let daysObj = {};

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
            processWeather(response)
        })
        .catch(function(err) {
            console.log(err);
        })
}

function processWeather(response){
    console.log(response);

    const now = new Date();
    const currentHour = now.getHours();

    currObj.currentTemp = response.days[0].hours[currentHour].temp;
    currObj.currentConditions = response.days[0].hours[currentHour].conditions;
    currObj.currentWind = response.days[0].hours[currentHour].windspeed;


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

    daysObj.days = response.days;
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for(const { datetime, tempmax, tempmin, conditions, windspeed, hours} of daysObj.days) {
        const dayList = document.createElement('div');
        display.appendChild(dayList);
        dayList.classList.add('day');

        const [year, month, day] = datetime.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        const weekday = date.toLocaleDateString(undefined, { weekday: "long" });

        const dateItem = document.createElement('h1');
        dateItem.textContent = weekday;
        dayList.appendChild(dateItem);

        const tempMaxItem = document.createElement('p');
        tempMaxItem.textContent = `High: ${tempmax} Fahrenheit`;
        dayList.appendChild(tempMaxItem);

        const tempMinItem = document.createElement('p');
        tempMinItem.textContent = `Low: ${tempmin} Fahrenheit`;
        dayList.appendChild(tempMinItem);

        const conditionItem = document.createElement('p');
        conditionItem.textContent = conditions;
        dayList.appendChild(conditionItem);

        getIcon(conditions, dayList);

        const expandButton = document.createElement('button');
        expandButton.classList.add('hour-button');
        expandButton.textContent = "Expand";
        dayList.appendChild(expandButton);

        expandButton.addEventListener("click", () => {
                for(let i = 0; i < 24; i++) {
                    const hourItem = document.createElement('p');
                    hourItem.classList.add('hour-item');
                    if(i === 0) {
                        hourItem.textContent = `12 AM: ${hours[i].temp} F`;
                    }
                    else if(i < 12) {
                        hourItem.textContent = `${i} AM: ${hours[i].temp} F`;
                    }
                    else {
                        hourItem.textContent = `${i - 12} PM: ${hours[i].temp} F`;
                    }
                    dayList.appendChild(hourItem);
                }
                const collapseButton = document.createElement('button');
                collapseButton.classList.add('hour-button');
                collapseButton.textContent = "Collapse"
        
                dayList.removeChild(expandButton);
                dayList.appendChild(collapseButton);

                collapseButton.addEventListener("click", () => {
                    const hourItems = dayList.querySelectorAll('.hour-item');
                    hourItems.forEach(item => item.remove());
                    dayList.removeChild(collapseButton);
                    dayList.appendChild(expandButton);
                })
        })
        



        /*const windItem = document.createElement('p');
        windItem.textContent = `Wind Speed: ${windspeed} mph`;
        dayList.appendChild(windItem);*/

        
    }

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



