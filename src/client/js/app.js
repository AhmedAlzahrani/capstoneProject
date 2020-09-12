import { addPhoto } from "./addPhoto";
import { displayError } from "./displayError";

let tripNumber = 0;
const city = document.getElementById("city");
const date = document.getElementById("date");
const addBtn = document.getElementById("add");
const geonames_username = "ahmed42960";
const weatherbit_api_key = "f96f39f6055e4fe89427f08a6073c0eb";
let highTemp , lowTemp , currentTemp;
let imageURL = "";

addBtn.addEventListener("click" , addTrip);


// this function calls another function in addPhoto.js in order to fetch a photo from the pixbay api
async function addTrip(){
    imageURL = await addPhoto(city.value);
    fetchDestinationData(city.value, dateDifference(new Date(date.value)));
}

// fetchDestinationData: This app calls the geonames and weatherBit in order to fetch weather

function fetchDestinationData(cityName , daysLeft){
    fetch(`http://api.geonames.org/findNearbyPostalCodesJSON?placename=${cityName}&username=${geonames_username}`)
    .then(response => response.json())
    .then(data => {
        try{
            return {lng:data["postalCodes"][0]["lng"] , lat:data["postalCodes"][0]["lat"]};
        }catch(exception){
            displayError();
        }
    }).then(coordination => {
        if(daysLeft >= 8){
            // for trips which is after a week from now
            try{
                fetch(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${coordination.lat}&lon=${coordination.lng}&key=${weatherbit_api_key}`)
                .then(response => response.json())
                .then(data => {
                highTemp = data["data"][15]["max_temp"];
                lowTemp = data["data"][15]["min_temp"];
                return [highTemp , lowTemp];
                }).then(weatherData => {
                displayTrip(imageURL , city.value , weatherData);
                })
            }catch(exception){
                // No need to call displayError again
            }
            
        }
        else{
            // for trips within a week
            fetch(`https://api.weatherbit.io/v2.0/current?lat=${coordination.lat}&lon=${coordination.lng}&key=${weatherbit_api_key}`)
            .then(response => response.json())
            .then(data => {
                currentTemp = data["data"][0]["temp"];


                return [currentTemp];
            }).then(weatherData => {
                displayTrip(imageURL , city.value , weatherData);
            })
        }
        
    })
}

// this function display the trip information in the browser
function displayTrip(imageURL , dest , weather){
    document.getElementById("errorMsg").remove();
    const container = document.getElementById("trips");
    
    const tripDivContainer = document.createElement("div");
    tripDivContainer.classList.toggle("row");
    tripDivContainer.setAttribute("id" , `trip_${++tripNumber}`);
    tripDivContainer.style = "border-bottom: 1px solid black; padding:20px";
    
    const icon = document.createElement("i");
    icon.classList.toggle("fas");
    icon.classList.toggle("fa-minus-circle")
    
    // The removal functionality done by the rmBtn
    const rmBtn = document.createElement("button");
    rmBtn.appendChild(icon);
    rmBtn.classList.toggle("btn");
    rmBtn.classList.toggle("btn-danger");
    rmBtn.addEventListener("click" , () => {
        tripDivContainer.remove();
        fetch("localhost");
    });
    
    const btnDiv = document.createElement("div");
    btnDiv.classList.toggle("col-md-3");
    const imgDiv = document.createElement("div");
    imgDiv.classList.toggle("col-md-3");
    
    const destDiv = document.createElement("div");
    destDiv.classList.toggle("col-md-3");
    
    const tempDiv = document.createElement("div");
    tempDiv.classList.toggle("col-md-3");
    
    const img = document.createElement("img")
    img.setAttribute("src" , `${imageURL}`);
    img.setAttribute("alt" , `${dest}`)
    
    const destH4 = document.createElement("h4");
    destH4.textContent = city.value;
    
    const weatherH4 = document.createElement("h4");
    if(weather.length === 1)
    weatherH4.textContent = `Temperature: ${weather[0]}`;
    else
    weatherH4.textContent = `Temperature: High - ${weather[0]} , Low - ${weather[1]}`;
    
    btnDiv.appendChild(rmBtn);
    imgDiv.appendChild(img);
    destDiv.appendChild(destH4);
    tempDiv.appendChild(weatherH4);
    
    tripDivContainer.appendChild(btnDiv);
    tripDivContainer.appendChild(imgDiv);
    tripDivContainer.appendChild(destDiv);
    tripDivContainer.appendChild(tempDiv);
    
    container.appendChild(tripDivContainer);
    
    // the function addTripToServer is called here in order send the updated tripNumber(counter)
    addTripToServer({imgURL: imageURL , destination: dest , weather: weather})
}

function addTripToServer(tripData){
    fetch("http://localhost:1200/addTrip" , {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(tripData) // body data type must match "Content-Type" header
  });
}

function dateDifference(tripDate){
    // This variable represents the milliseconds in a day
    const msDay = 24 * 60 * 60 * 1000,
    today = new Date()
    return Math.floor((tripDate - today) / msDay);
}


export default { addTrip }