$(document).ready(function () {
    //get the current trip from session storage
    const trip = sessionStorage.getItem("currentTripId");

    //Read, update and delete functions
    //Read
    function getTripInfo(tripId) {
        return new Promise(async (resolve, reject) => {
            try {
                let tripInfo = await axios.get(`/api/trips/byid/${tripId}`);
                resolve(tripInfo);
            } catch (error) {
                reject(error);
            }
        });
    }

    function getCities(tripId) {
        return new Promise(async (resolve, reject) => {
            try {
                let cities = await axios.get(`/api/cities/bytrip/${tripId}`);
                cities = cities.data;
                resolve(cities);
            } catch (error) {
                reject(error);
            }
        });
    }

    function getActivities(cityId) {
        return new Promise(async (resolve, reject) => {
            try {
                let activities = await axios.get(`/api/activities/${cityId}`);
                resolve(activities);
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
                resolve(cancelledAct);
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
        let cities = await getCities(tripId);
        //fill in the tripName
        $("#tripName").text(tripInfo.data.trip_name);
        //empty the cities section
        $("#citiesSection").empty();
        cities.forEach(async (city, index) => {
            //get the activities for this city
            const newDiv = $('<div class="container" id="trip-card"></div>');
            let activities = await getActivities(city.id);
            activities = activities.data;
            console.log(activities);
            //declare a variable to hold the city name
            let newHeading;
            //if the city is not complete, display the header without strikethrough
            if (city.status == 0) newHeading = $(`<h3>${city.city_name}</h3><button class="delBtn" data-type="city" data-id="${city.id}">Cancel this city</button>`);
            //if the city is complete, display it with strikethrough
            else newHeading = $(`<h3><s>${city.city_name}</s></h3><button class="delBtn" data-type="city" data-id="${city.id}">Cancel this city</button>`);
            // 
            let newActHtml = '';
            activities.forEach(activity => {
                if (activity.status == 0) {
                    newActHtml += `<p>${activity.activity_name}</p><button class="checkBtn" data-type="activity" data-id="${activity.id}">Done!</button><button class="delBtn" data-type="activity" data-id="${activity.id}">Cancel this Activity</button>`
                } else {
                    newActHtml += `<p><s>${activity.activity_name}</s></p><button class="delBtn" data-type="activity" data-id="${activity.id}">Cancel this Activity</button>`
                }
            });
            console.log(newActHtml);
            newActHtml = $(newActHtml);
            $("#citiesSection").append(newDiv);
            newDiv.append(newHeading);
            newDiv.append(newActHtml);
        });
    }

    //render the page!
    renderPage(trip);


    //On click functions
    $("#citiesSection").on("click", async function (event) {
        event.preventDefault();
        const button = $(event.target);
        console.log(button);
        console.log(button.attr("class"));
        if (button.attr("class") === "checkBtn") {
            console.log('hey');
            id = button.attr("data-id");
            await updateActStatus(id, 1);
            renderPage(trip);
        }
        else if (button.attr("class") === "delBtn") {
            if (button.attr("data-type") === "city") {
                console.log("delete city");
                id = button.attr("data-id");
                await cancelCity(id)
                renderPage(trip);
            } else if (button.attr("data-type") === "activity") {
                console.log("delete activity");
                id = button.attr("data-id");
                await cancelActivity(id);
                renderPage(trip);
            }
        }
    });
});