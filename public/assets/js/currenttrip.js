$(document).ready(function () {
    //get the current trip from session storage
    const trip = sessionStorage.getItem("currentTripId");
    console.log(trip);

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
        console.log(tripInfo);
        //fill in the tripName
        $("#tripName").text(tripInfo.data.trip_name);
        //empty the cities section
        $("#citiesSection").empty();
        let allCitiesDone = true;
        cities.forEach(async (city, index) => {
            //get the activities for this city
            let activities = await getActivities(city.id);
            activities = activities.data;
            console.log(activities);
            //declare a variable to hold the city name
            let newHeading = '<div class="container" id="city-card">';
            //if the city is not complete, display the header without strikethrough
            if (city.status == 0) {
                newHeading += `<h3>${city.city_name}</h3></div>`;
                allCitiesDone = false;
            }
            //if the city is complete, display it with strikethrough
            else newHeading += `<h3><s>${city.city_name}</s></h3></div>`;
            // 
            let newActHtml = '';
            let allDone = true;
            activities.forEach(activity => {
                //if there are any incomplete activities (status = 0) then they are not allDone
                if (activity.status == 0) { allDone = false; }

                //add a dropdown menu for each activity
                newActHtml += `<div id="progress-card" data-state="hidden" class="activity">
                <p>${activity.status === 0 ? "" : "<s>"}${activity.activity_name}${activity.status === 0 ? "" : "</s>"}</p>
                <div hidden>
                    <div>
                        <img src="${activity.image}" alt="Image of ${activity.activity_name}" id="city-pic" style="margin-left:1%;"/>
                    </div>
                    <div>
                        <p>${activity.description}</p>
                        <br>
                        <p>Address: ${activity.address}</p>
                        <p>Phone: ${activity.phone}</p>
                        <a href="${activity.yelp}" style="color:yellow;">View On Yelp</a>
                    </div>
                </div>
                <button data-function="checkBtn" data-type="activity" class="button-card" data-id="${activity.id}">Done!</button>
                <button data-function="delBtn" data-type="activity" class="button-card" data-id="${activity.id}">Cancel</button>
            </div>`
            });
            newActHtml += '</div>';
            //if all the activities are done, but the city is not complete, add a button to complete it
            if (allDone && city.status == 0) newHeading += `<button class="button-card" data-function="checkBtn" data-type="city" data-id="${city.id}">All done in ${city.city_name}!</button>`;

            //jQuery-ify the strings
            newHeading = $(newHeading);
            newActHtml = $(newActHtml);

            //append jQuery elements
            $("#citiesSection").append(newHeading);
            $("#citiesSection").append(newActHtml);
            if (allCitiesDone) $("#citiesSection").append($(`<button class=button-card data-function="tripComplete">This journey is complete!</button>`));
        });
    }

    //render the page!
    renderPage(trip);


    //On click functions
    $("#citiesSection").on("click", async function (event) {
        event.preventDefault();
        const button = $(event.target);
        if (button.attr("data-function") === "checkBtn") {
            if (button.attr("data-type") === "activity") {
                id = button.attr("data-id");
                await updateActStatus(id, 1);
                renderPage(trip);
            } else if (button.attr("data-type") === "city") {
                id = button.attr("data-id");
                await updateCityStatus(id, 1);
                renderPage(trip);
            };
        }
        else if (button.attr("data-function") === "delBtn") {
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
        else if (button.attr("data-function") === "tripComplete") {
            await updateTripStatus(trip, 2);
            window.location.replace("/dashboard");
        }

        else if (button.attr("class") === "activity") {
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