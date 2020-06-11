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
                let updatedTrip = await axios.put(`/api/trips/status/${id}`, {
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
            let activities = await getActivities(city.id);
            activities = activities.data;
            console.log(activities);
            //declare a variable to hold the city name
            let newHeading = `<div class="container" id="city-card"><h3>${city.city_name}</h3></div>`;
            let newActHtml = '';
            activities.forEach(activity => {
                //if there are any incomplete activities (status = 0) then they are not allDone
                if (activity.status == 0) { allDone = false; }

                //add a dropdown menu for each activity
                newActHtml += `<div id="progress-card" data-state="hidden" class="activity">
                <p>${activity.activity_name}</p>
                <div hidden>
                    <div>
                        <img src="${activity.image}" alt="Image of ${activity.activity_name}" id="city-pic" style="margin-left:1%;"/>
                    </div>
                </div>
            </div>`
            });
            newActHtml += '</div>';

            //jQuery-ify the strings
            newHeading = $(newHeading);
            newActHtml = $(newActHtml);

            //append jQuery elements
            $("#citiesSection").append(newHeading);
            $("#citiesSection").append(newActHtml);
        });
    }

    //render the page!
    renderPage(trip);


    //On click functions
    $("#citiesSection").on("click", async function (event) {
        event.preventDefault();
        const button = $(event.target);
        if (button.attr("class") === "activity") {
            let state = button.attr("data-state");
            if (state === "hidden") {
                button.attr("data-state", "displayed");
                button.children("div").removeAttr("hidden");
            }
            else {
                console.log("yo");
                button.attr("data-state", "hidden");
                button.children("div").attr("hidden", "");
            }
        }
    });
});