$(document).ready(function () {
    //get the current trip from session storage
    const trip = sessionStorage.getItem("currentTripId");

    //Read, update and delete functions
    //Read
    function getTripInfo(tripId) {
        return new Promise(async (resolve, reject) => {
            try {
                let tripInfo = await axios.get(`/api/trips/byid/${id}`);
                resolve(tripInfo);
            } catch (error) {
                reject(error);
            }
        });
    }

    function getCitiesAndActivities(tripId) {
        return new Promise(async (resolve, reject) => {
            try {
                let cities = await axios.get(`/api/cities/bytrip/${tripId}`);
                cities.forEach(city => {
                    //add a new property to each city, which is an array of its activity objects
                    city["activities"] = await axios.get(`/api/activities/${city.id}`);
                });
                resolve(cities);
            } catch (error) {
                reject(error);
            }
        });
    }

    //Delete
    function cancelCity(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let cancelledCity = await axios.delete(`/api/cities/${id}`);
                resolve(cancelledCity);
            } catch (error) {
                reject(error);
            }
        });
    }

    function cancelActivity(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let cancelledAct = await axios.delete(`/api/activities/${id}`);
                resolve(cancelAct);
            } catch (error) {
                reject(error);
            }
        })
    }

    //Status updates
    function updateCityStatus(id, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let updatedCity = await axios.put(`/api/cities/status/${id}`, {
                    status: status
                });
                resolve(updatedCity);
            } catch (error) {
                reject(error);
            }
        });
    }

    function updateActStatus(id, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let updatedAct = await axios.put(`/api/activities/status/${id}`, {
                    status: status
                });
                resolve(updatedAct);
            } catch (error) {
                reject(error);
            }
        });
    }

    function updateTripStatus(id, status) {
        return new Promise(async (resolve, reject) => {
            try {
                let updatedTrip = await axios.put(`api/trips/status/${id}`, {
                    status: status
                });
                resolve(updatedTrip);
            } catch (error) {
                reject(error);
            }
        });
    }
    //Rendering functions
    async function renderPage(tripId) {
        let tripInfo = await getTripInfo(tripId);
        let cities = await getCitiesAndActivities(tridId);
        //check the info that is obtained
        console.log(tripInfo, cities);
        //fill in the tripName
        $("#tripName").text(tripInfo.trip_name);
        //empty the cities section
        $("#citiesSection").empty();
        cities.forEach(city => {
            //declare a variable to hold the city name
            let newHeading;
            //if the city is not complete, display the header without strikethrough
            if (city.status = 0) newHeading = $(`<h3>${city.city_name}</h3><button class="delBtn" data-type="city" data-id="${city.id}">Cancel this city</button>`);
            //if the city is complete, display it with strikethrough
            else newHeading = $(`<h3><s>${city.city_name}</s></h3><button class="delBtn" data-type="city" data-id="${city.id}">Cancel this city</button>`);
            //create an empty string to hold the activities html
            let newActivities = "";
            city.activities.forEach(activity => {
                //if the activity is not complete, display the text without strikethrough, and display a check mark button
                if (activity.status = 0) newActivities += `<p>${activity.activity_name}<button class="checkBtn" data-type="activity" data-id="${activity.id}">Check!</button><button class="delBtn" data-type="activity" data-id="${activity.id}">Cancel this Activity</button></p>`
                //otherwise, if it is complete:
                else newActivities += `<p><s>${activity.activity_name}</s><button class="delBtn" data-type="activity" data-id="${activity.id}">Cancel this Activity</button></p>`;
            });
            //Convert string into jQuery format
            newActivities = $(newActivities);
            //append
            $("#citiesSection").append(newHeading);
            $("#citiesSection").append(newActivities);
        });
    }

    //render the page!
    renderPage(1);
});