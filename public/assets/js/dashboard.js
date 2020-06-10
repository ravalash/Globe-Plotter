const plannedList = $("#planned-trips-list");
const inProgressList = $("#trips-in-progress-list");
const completedList = $("#completed-trips-list");

//db call to be added; once added,
let userId = "dan";
// let trips = getTrips(userId)
const trips = [];
const cities = [];
$.get("/api/trips")
  .then(function (result) {
    result.forEach((element) => {
      trips.push(element);
    });
    $.get("/api/cities").then(function (result) {
      result.forEach((element) => {
        cities.push(element);
      });
      for (var i = 0; i < trips.length; i += 1) {
        var currentTrip = trips[i];
        var citiesList = "";
        currentTrip.cities = [];
        cities.forEach((element) => {
          if (element.TripId === currentTrip.id) {
            currentTrip.cities.push(element);
          }
        });
        if (currentTrip.cities.length != 0) {
          var citiesList = citiesListGenerator(currentTrip.cities);
        }
        // Checks if trip is in edit, in progress, or compelte; sorts accordingly
        if (currentTrip.status == 0) {
          plannedList.append(
            '<div class="container" id="trip-card" data-TripId =' +
              currentTrip.id +
              "> <h1><b>" +
              currentTrip.trip_name +
              "</b></h1> <p>" +
              citiesList +
              "</p> <p>From " +
              currentTrip.start_date +
              " to " +
              currentTrip.end_date +
              "</p></div>"
          );
        } else if (currentTrip.status == 1) {
          inProgressList.append(
            '<div class="container" id="trip-card" data-TripId = ' +
              currentTrip.id +
              "> <h1><b>" +
              currentTrip.trip_name +
              "</b></h1> <p>" +
              citiesList +
              "</p> <p>From " +
              currentTrip.start_date +
              " to " +
              currentTrip.end_date +
              "</p></div>"
          );
        } else if (currentTrip.status == 2) {
          completedList.append(
            '<div class="container" id="trip-card"> <h1><b>' +
              currentTrip.trip_name +
              "</b></h1> <p>" +
              citiesList +
              "</p> <p>From " +
              currentTrip.start_date +
              " to " +
              currentTrip.end_date +
              "</p></div>"
          );
        }
      }

      $(plannedList)
        .children("#trip-card")
        .click(function () {
          event.preventDefault();
          console.log("you clicked me!");
          const selectedId = $(this).attr("data-tripid");
          const trip_name = $(this).eq(0).find("h1").text();
          const start_date = $(this).eq(0).find("p").text().substring(5, 15);
          const end_date = $(this).eq(0).find("p").text().substring(19, 29);
          $.ajax({
            method: "PUT",
            url: `/api/trips/${selectedId}`,
            data: {
              trip_name: trip_name,
              start_date: start_date,
              end_date: end_date,
              status: 1,
            },
          }).then(function () {
            window.location.href = "/dashboard";
          });
        });

      $(inProgressList)
        .children("#trip-card")
        .click(function () {
          event.preventDefault();
          sessionStorage.setItem("currentTripId", $(this).attr("data-tripid"));
          window.location.href = "/currenttrip";
        });

      $(completedList)
        .children("#trip-card")
        .click(function () {
          event.preventDefault();
          sessionStorage.setItem("currentTripId", $(this).attr("data-tripid"));
          window.location.href = "/comptrip";
        });
    });
  })
  .catch(console.error());

function citiesListGenerator(cities) {
  var remaining = cities.length - 2;
  if (cities.length == 1) {
    return cities[0].city_name;
  } else if (cities.length == 2) {
    return cities[0].city_name + " and " + cities[1].city_name;
  } else if (cities.length == 3) {
    return cities[0].city_name + ", " + cities[1].city_name + " and 1 more";
  } else {
    return (
      cities[0].city_name +
      ", " +
      cities[1].city_name +
      " and " +
      remaining +
      " more"
    );
  }
}

async function addTrip(trip_name, start_date, end_date, status) {
  return new Promise(async function (resolve, reject) {
    try {
      const response = await axios.post("/api/trips", {
        trip_name: trip_name,
        start_date: start_date,
        end_date: end_date,
        status: status,
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
  let newTrip = await addTrip("Joes trip", "2020-08-01", "2020-08-31", 0);
  console.log(newTrip.data.id);
  sessionStorage.setItem("currentTripId", newTrip.data.id);
  // for testing purposes go to seach city
  window.location.replace("/searchcity");
});

//Add event listener for clicking on a trip
