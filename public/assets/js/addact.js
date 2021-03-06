//make sure the page is loaded
//axios cdn will be required in the hbs file
$(document).ready(function () {
    //check that the city id has been saved correctly
    const currentCity = sessionStorage.getItem("currentCityId");
    console.log(currentCity);

    //Functions////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Search Yelp
    async function searchYelp(category, latitude, longitude) {
        return new Promise(async (resolve, reject) => {
            const yelpURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&categories=${category}&sort_by=rating&limit=5`;
            const yelpKey =
                "PBIBFOUhO_4qmjGG71O7Usz9UrhkELnY6uO7jobzr4JAULnJzdL62SPxOOA4ZafyGrVW7lHCLdc-UawfWg_CKByHBejtRsgYSm8Ae4LKzvng-054oVxiUMfPRcnRXnYx";
            try {
                const response = await axios.get(yelpURL, {
                    headers: { Authorization: `Bearer ${yelpKey}` },
                });
                let list = response.data.businesses;
                console.log(list);
                list = list.map((element) => {
                    element = {
                        name: element.name,
                        address: element.location.display_address.join(", "),
                        phone: element.display_phone,
                        yelpURL: element.url,
                        image: element.image_url,
                        description: element.categories[0].title
                    };
                    return element;
                });
                resolve(list);
            } catch (error) {
                reject(error);
            }
        });
    }
    //Search Yelp and displayresults
    async function displayRes(categoryText, searchResults) {
        //display the prompt text for this category
        $("#promptText").text(categoryText);
        for (let i = 0; i < searchResults.length; i++) {
            $("#actionList").append(
                '<div class="container" id="choice-card" data-index=' +
                i +
                "> <p><b>" +
                searchResults[i].name +
                '</b> </p><a href="' +
                searchResults[i].yelpURL +
                '" target="_blank"<i><p>Tell me more!</p></i></a> <button class="addBtn">Add</button> </div> <br>'
            );
        }
    }

    //Get the current city's latitude and longitude
    async function getCityInfo(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let city = await axios.get(`/api/cities/${id}`);
                resolve(city);
            } catch (error) {
                reject(error);
            }
        });
    }

    //Get the next activity type to add based on what (if anything) already exists in the db
    async function getNextActivity(cityId) {
        return new Promise(async (resolve, reject) => {
            //set up an array of different activity categories
            let categories = [
                {
                    name: "food",
                    queryTxt: "food, All",
                    uiTxt: "Where would you like to eat?",
                },
                {
                    name: "museums",
                    queryTxt: "museums, All",
                    uiTxt: "What museum do you want to check out?",
                },
                {
                    name: "tours",
                    queryTxt: "tours, All",
                    uiTxt: "Which tour sounds good?",
                },
                {
                    name: "bars",
                    queryTxt: "bars, All",
                    uiTxt: "Where would you want to grab a drink?",
                },
                {
                    name: "landmarks",
                    queryTxt: "landmarks, All",
                    uiTxt: "Which landmark would you like to visit?",
                },
            ];
            try {
                let activities = await axios.get(`/api/activities/${cityId}`);
                activities = activities.data;
                console.log(activities);
                //transform the resultant array into an array just of the activity types
                if (activities.length > 0)
                    activities = activities.map(
                        (activity) => (activity = activity.activity_type)
                    );
                console.log(activities);
                //filter out categories that exist in the db already
                if (activities.length > 0) {
                    categories = categories.filter((category) => {
                        let alreadyExists = false;
                        activities.forEach((activity) => {
                            //if the name of the category matches an existing activity, filter it out.
                            if (category.name === activity) alreadyExists = true;
                        });
                        //if the name of the category matches none of the activities, keep it in the array!
                        if (alreadyExists) return false;
                        else return category;
                    });
                    console.log(categories);
                }
                resolve(categories[0]);
            } catch (error) {
                reject(error);
            }
        });
    }

    //add an activity
    async function addAct(
        activity_name,
        activity_type,
        image,
        yelp,
        status,
        address,
        phone,
        description,
        cityId
    ) {
        //can add phone, address, etc later
        return new Promise(async function (resolve, reject) {
            try {
                const response = await axios.post("api/activities", {
                    activity_name: activity_name,
                    activity_type: activity_type,
                    image: image,
                    yelp: yelp,
                    status: status,
                    address: address,
                    phone: phone,
                    description: description,
                    CityId: cityId,
                });
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    }

    async function initPage(cityId) {
        let cityInfo = await getCityInfo(cityId);
        console.log(cityInfo);
        let nextAct = await getNextActivity(cityId);
        if (!nextAct) window.location.replace("/searchcity");
        let searchResults = await searchYelp(
            nextAct.queryTxt,
            cityInfo.data.lat,
            cityInfo.data.lon
        );
        await displayRes(nextAct.uiTxt, searchResults);

        $(".addBtn").on("click", async function (event) {
            event.preventDefault();
            const index = Number($(event.target).parent().attr("data-index"));
            const addedAct = searchResults[index];
            let newAct = await addAct(
                addedAct.name,
                nextAct.name,
                addedAct.image,
                addedAct.yelpURL,
                0,
                addedAct.address,
                addedAct.phone,
                addedAct.description,
                cityId
            );
            window.location.replace("/addact");
        });
    }

    //initialize the page after grabbing the city id from session storage
    initPage(currentCity);
});
