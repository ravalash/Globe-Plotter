$(document).ready(async function () {
    //this function creates a new trip
    async function addTrip(trip_name, start_date, end_date) {
        return new Promise(async function (resolve, reject) {
            try {
                const response = await axios.post("/api/trips", {
                    trip_name: trip_name,
                    start_date: start_date,
                    end_date: end_date,
                    status: 0
                });
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    }
    //create a new trip and save the id in session storage
    $("#newTripForm").on("submit", async function (event) {
        event.preventDefault();
        const tripName = $("#tripName").val().trim();
        const startDate = $("#startDate").val().trim();
        const endDate = $("#endDate").val().trim();
        if (tripName && startDate && endDate) {
            let newTrip = await addTrip(tripName, startDate, endDate);
            sessionStorage.setItem("currentTripId", newTrip.data.id);
            $("#addCity").removeAttr("hidden");
            $("button").attr("hidden", "true");
        }
    });
});