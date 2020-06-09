$(document).ready(async function () {
    //this function creates a new trip
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
    //create a new trip and save the id in session storage
    let newTrip = await addTrip("Joes trip", "8/1/2020", "8/31/2020");
    sessionStorage.setItem("currentTripId", newTrip.data.id);
});