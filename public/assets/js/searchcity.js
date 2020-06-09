$(document).ready(function () {
    //set up the geocoder
    const geocoder = new google.maps.Geocoder;

    //get the current trip id
    const tripId = sessionStorage.getItem("currentTripId");
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

    // //Get a city's image 
    // function getCityImage(placeName) {
    //     let query = wikiQuery()
    //     let URL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + query + "&prop=images"
    //     $.get(URL, function (data, status) {
    //         console.log(data)
    //     }, 'html');
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
            let newCity = await addCity(placeName, lat, lon, cityImage, 0, tripId);
            //save the new city's id in session storage and move on to adding activities
            sessionStorage.setItem("currentCityId", newCity.data.id);
            window.location.replace("/addact");
        }
    });
})