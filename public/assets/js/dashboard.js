const plannedList = $("#planned-trips-list");
const inProgressList = $("#trips-in-progress-list");
const completedList = $("#completed-trips-list")

//db call to be added; once added, 
let userId = "dan"
// let trips = getTrips(userId)
var trips = [
    {
        trip_name: "Buffalo",
        start_date: "June 23",
        end_date: "June 28",
        status: "edit"
    },
    {
        trip_name: "Miami",
        start_date: "July 8",
        end_date: "July 12",
        status: "edit"
    },
    {
        trip_name: "Seattle",
        start_date: "June 2",
        end_date: "June 9",
        status: "inProgress"
    },
    {
        trip_name: "Paris",
        start_date: "May 20",
        end_date: "May 24",
        status: "completed"
    }
]

for (var i = 0; i < trips.length; i += 1) {
    var currentTrip = trips[i];

    // Checks if trip is in edit, in progress, or compelte; sorts accordingly
    if (currentTrip.status == "edit") {
        plannedList.append('<div class="container" id="trip-card"> <h1>' + currentTrip.trip_name + ' </h1> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
    }
    else if (currentTrip.status == "inProgress") {
        inProgressList.append('<div class="container" id="trip-card"> <h1>' + currentTrip.trip_name + ' </h1> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
    }
    else if (currentTrip.status == "completed") {
        completedList.append('<div class="container" id="trip-card"> <h1>' + currentTrip.trip_name + ' </h1> <p>From ' + currentTrip.start_date + ' to ' + currentTrip.end_date + '</p></div>')
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