const plannedList = $("#planned-trips-list");
const inProgressList = $("#trips-in-progress-list");
const completedList = $("#completed-trips-list")

//db call to be added; once added, 
let userId = "dan"
// let trips = getTrips(userId)
var trips = [
    {
        trip_name: "Western New York",
        start_date: "June 23",
        end_date: "June 28",
        status: "edit",
        cities: ["Buffalo", "Rochester", "Syracuse"]
    },
    {
        trip_name: "Florida",
        start_date: "July 8",
        end_date: "July 12",
        status: "edit",
        cities: ["Miami", "Tampa", "Naples", "Orlando"]
    },
    {
        trip_name: "Pacific Northwest",
        start_date: "June 2",
        end_date: "June 9",
        status: "inProgress",
        cities: ["Seattle", "Portland", "Aberdeen", "Eugene", "Tacoma", "Vancouver"]
    },
    {
        trip_name: "France",
        start_date: "May 20",
        end_date: "May 24",
        status: "completed",
        cities: ["Nice", "Paris"]
    }
]


for (var i = 0; i < trips.length; i += 1) {
    var currentTrip = trips[i];
    var citiesList = citiesListGenerator(currentTrip.cities)
    // Checks if trip is in edit, in progress, or compelte; sorts accordingly
    if (currentTrip.status == "edit") {
        plannedList.append('<div class="container" id="trip-card"> <h1><b>' + currentTrip.trip_name + '</b></h1> <p>' + citiesList + '</p> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
    }
    else if (currentTrip.status == "inProgress") {
        inProgressList.append('<div class="container" id="trip-card"> <h1><b>' + currentTrip.trip_name + '</b></h1> <p>' + citiesList + '</p> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
    }
    else if (currentTrip.status == "completed") {
        completedList.append('<div class="container" id="trip-card"> <h1><b>' + currentTrip.trip_name + '</b></h1> <p>' + citiesList + '</p> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
    }
}

function citiesListGenerator() {
    var cities = currentTrip.cities
    var remaining = cities.length - 2
    if (cities.length == 1) {
        return cities[0]
    } else if (cities.length == 2) {
        return cities[0] + " and " + cities[1]
    } else if (cities.length == 3) {
        return cities[0] + ", " + cities[1] + " and 1 more"
    } else {
        return cities[0] + ", " + cities[1] + " and " + remaining + " more"
    }
}

async function addTrip(trip_name, start_date, end_date) {
    return new Promise(async function (resolve, reject) {
        try {
            const response = await axios.post("/api/trips", {
                trip_name: trip_name,
                start_date: start_date,
                end_date: end_date
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
}

//Add event listener for new trip button
$("#newTrip").on("click", async function (event) {
    event.preventDefault();
    console.log("you clicked me!");
    let newTrip = await addTrip("Joes trip", "8/1/2020", "8/31/2020");
    console.log(newTrip.data.id);
    sessionStorage.setItem("currentTripId", newTrip.data.id);
    // for testing purposes go to seach city
    window.location.replace("/searchcity");
})