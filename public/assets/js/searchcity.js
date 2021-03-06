$(document).ready(function () {
    //set up the geocoder
    const cityImage = "testimagestring.com"
    const geocoder = new google.maps.Geocoder;

    //get the current trip id
    const tripId = Number(sessionStorage.getItem("currentTripId"));
    //check that this is obtained correctly
    console.log(tripId);

    //identify the submit and add buttons, and the <p> tag where a searched city will go
    const submitBtn = $("#submitBtn");
    const addBtn = $("#addBtn");
    const searchedCity = $("#searchedCity");

    //Set up an empty variable for search results...
    let cityData;

    // const input = $("#city"); //can change this id name depending on what dan name it
    // console.log(input);
    // new google.maps.places.Autocomplete(input)

    //Look up a city's lat and lon
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

    // Get a city's image 
    // //Gets photo reference
    // function getCityImage(placeName) {
    //     return new Promise(async function (resolve, reject) {
    //         try {
    //             let query = placeName + "&key=AIzaSyDfSBIwm7UFIwP9C4nZq2gi_IhL4z0dkS4"
    //             let URL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query
    //             console.log(URL)
    //             $.get(URL, function (data, status) {
    //                 var data = JSON.parse(data)
    //                 var reference = data.results[0].photos[0].photo_reference
    //                 var image = getPic(reference)
    //                 resolve(image)
    //             }, 'html');

    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // }
    // //Gets photo url
    // async function getPic(reference) {
    //     return new Promise(async function (resolve, reject) {
    //         try {
    //             let query = reference + "&key=AIzaSyDfSBIwm7UFIwP9C4nZq2gi_IhL4z0dkS4"
    //             let URL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photo_reference=" + query
    //             console.log(URL)
    //             $.get(URL, function (data, status) {
    //                 var image = data
    //                 resolve(image)
    //             }, 'html');
    //         } catch (error) {
    //             reject(error)
    //         }
    //     })
    // }

    //Post a new city
    async function addCity(city_name, lat, lon, image, status, tripId) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await axios.post("api/cities", {
                    city_name: city_name,
                    lat: lat,
                    lon: lon,
                    image: image,
                    status: status,
                    TripId: tripId
                })
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    }

    //Event listeners

    submitBtn.on("click", async function (event) {
        event.preventDefault();
        const city = $("#city").val().trim();
        cityData = await geocodeCity(city);
        console.log(cityData);
        searchedCity.text(cityData.placeName);
        addBtn.removeAttr("hidden");
    });

    addBtn.on("click", async function (event) {
        event.preventDefault();
        console.log("you clicked me!");
        if (cityData) {
            console.log(cityData);
            //use object destructuring to create variables to feed to the addCity function
            const [{ placeName }, { lat }, { lon }] = Array(3).fill(cityData);
            console.log(placeName);
            // let cityImage = await getCityImage(placeName)
            let cityImage = "testurl.com"
            let newCity = await addCity(placeName, lat, lon, cityImage, 0, tripId);
            console.log(cityImage)
            //save the new city's id in session storage and move on to adding activities
            sessionStorage.setItem("currentCityId", newCity.data.id);
            window.location.replace("/addact");
        }
    });
})