//must include <script src...> linked to google maps in the html document
const geocoder = new google.maps.Geocoder;

function initialize() {
    var input = document.getElementById('city'); //can change this id name depending on what dan name it
    new google.maps.places.Autocomplete(input);
}

//Look up a cities lat and lng
function geocodeCity(location) {
    return new Promise(async (resolve, reject) => {
        geocoder.geocode({ 'address': location }, function (results, status) {
            //Handler for gibberish entries into search box
            if (status == google.maps.GeocoderStatus.OK) {
                // currentCityGeo = results[0];
                const placeInfo = {
                    placeName: results[0].formatted_address,
                    lat: results[0].geometry.location.lat(),
                    lon: results[0].geometry.location.lng()
                }
                resolve(placeInfo);
            }
        })
    });
}

//search yelp
async function searchYelp(category, latitude, longitude) {
    return new Promise(async (resolve, reject) => {
        const yelpURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${category}&sort_by=rating&limit=5`;
        const yelpKey = 'PBIBFOUhO_4qmjGG71O7Usz9UrhkELnY6uO7jobzr4JAULnJzdL62SPxOOA4ZafyGrVW7lHCLdc' //enter yelp api key here
        try {
            const response = await axios.get(yelpURL, { headers: { Authorization: `Bearer ${yelpKey}` } });
            let list = response.data.businesses;
            list = list.map(element => {
                element = {
                    name: element.name,
                    address: element.location.display_address.join(", "),
                    phone: element.display_phone,
                    yelpURL: element.url,
                    image: element.image_url
                }
                return element;
            });
            resolve(list);
        } catch (error) {
            reject(error);
        }
    });
}
////////////////////////////////////////////////////////////////////Get functions//////////////////////////////////////////////////////////////////
//Get user

//Get trips from the API according to completed status
async function getTrips(userId) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.get("/api/trips/" + userId);
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//get cities from the api according to tripId
async function getCities(tripId) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.get("/api/cities/" + tripId)
            resolve(response);
        } catch (error) {
            console.error(error);
        }
    });
}

//get activities from the api according to cityId
async function getActivities(cityId) {
    try {
        const response = await axios.get("api/activities/" + cityId)
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

//////////////////////////////////////////////////////////////////Post functions//////////////////////////////////////////////////////////////////
//add a trip
async function addTrip(trip_name, userId) { //will eventually add start_date and end_date
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.post("api/trips", {
                trip_name: trip_name,
                userId: userId
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//add a city
async function addCity(city_name, lat, lon, tripId) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.post("api/cities", {
                city_name: city_name,
                lat: lat,
                lon: lon,
                tripId: tripId
            })
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//add an activity
async function addAct(activity_name, activity_type, image, yelp, cityId) { //can add phone, address, etc later
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.post("api/activities", {
                activity_name: activity_name,
                activity_type: activity_type,
                image: image,
                yelp: yelp,
                cityId: cityId
            })
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}


google.maps.event.addDomListener(window, 'load', initialize);

searchYelp("museums,all", 39.9525839, -75.1652215);

$("#sbmBtn").on("click", async function (event) {
    event.preventDefault();
    const city = $("#city").val().trim();
    const cityData = await geocodeCity(city);
    console.log(cityData);
    const newTag = $(`<h6>${cityData.placeName}</h6><button class="addCity" data-name=${cityData.placeName} data-lat=${cityData.lat} data-lon=${cityData.lon}>Add this city!</button>)`);
    $("#citiesDiv").empty();
    $("#citiesDiv").append(newTag);
});

$("#citiesDiv").on("click", async function (event) {
    const button = event.target;
    const cityName = $(button).attr("data-name");
    const lat = $(button).attr("data-lat");
    const lon = $(button).attr("data-lon");
    // let newCity = await addCity(cityName, lat, lon, 1);
    let activities = await searchYelp("museums, all", lat, lon);
    console.log(activities);
    activities.forEach(activity => {
        const newTag = $(`<hr><h6>${activity.name}</h6><br><ul><li>${activity.address}</li></ul><button class="addActivity">Add activity!</button>`);
        $("#actsDiv").append(newTag);
    });
});