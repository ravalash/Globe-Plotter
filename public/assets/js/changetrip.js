$(document).ready(function () {
    //get the current trip id from session storage
    const trip = sessionStorage.getItem("currentTripId");

    //CRUD
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

    //rendering the page
    async function renderPage(tripId) {
        let tripInfo = await getTripInfo(tripId);
        let cities = await getCities(tripId);
        console.log(tripInfo);
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
            let newHeading = '<div class="container" id="city-card">';
            //if there is more than one city, you can delete one
            newHeading += `<h3>${city.city_name}</h3>${cities.length > 1 ? '<button data-function="delBtn" data-type="city" class="button-card" data-id="' + city.id + '">Cancel City</button>' : ''}${activities.length < 5 ? '<button class="button-card" data-function="addBtn" data-type="activity" data-id="' + city.id + '">Add an activity</button>' : ""}</div>`;
            // 
            let newActHtml = `<div id="city-card">`;
            activities.forEach(activity => {
                newActHtml += `<p>${activity.activity_name}</p>`
                //if there is more than one activity, you can delete them
                if (activities.length > 1) {
                    newActHtml += '<button data-function="delBtn" data-type="activity" class="button-card" data-id="' + activity.id + '">Cancel</button>'
                }
            });
            newActHtml += "</div>";
            //jQuery-ify the strings
            newHeading = $(newHeading);
            newActHtml = $(newActHtml);

            //append jQuery elements
            $("#citiesSection").append(newHeading);
            $("#citiesSection").append(newActHtml);
        });
    }

    renderPage(trip);

    //on-click functions
    $("#addCity").on("click", function (event) {
        event.preventDefault();
        window.location.replace("/searchcity");
    })

    $("#citiesSection").on("click", async function (event) {
        event.preventDefault();
        const button = $(event.target);

        //if adding an activity
        if (button.attr("data-function") === "addBtn") {
            sessionStorage.setItem("currentCityId", button.attr("data-id"));
            window.location.replace("/addact");
        }

        else if (button.attr("data-function") === "delBtn") {
            console.log("delete");
            if (button.attr("data-type") === "city") {
                id = button.attr("data-id");
                await cancelCity(id);
                renderPage(trip);
            }
            else if (button.attr("data-type") === "activity") {
                id = button.attr("data-id");
                await cancelActivity(id);
                renderPage(trip);
            }
        }
    });
})