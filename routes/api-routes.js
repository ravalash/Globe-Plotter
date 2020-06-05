var db = require("../models");

module.exports = function (app) {
  app.get("/api/trips/:userId", function (req, res) {
    db.Trip.findAll({
      where: {
        userId: req.params.userId
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.get("/api/cities/:tripId", function (req, res) {
    db.City.findAll({
      where: {
        tripId: req.params.tripId
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  //post route for creating a new user
  app.post("/api/users", function (req, res) {
    console.log("Post request made");
    console.log(req.body);
    // db.User.create(req.body).then(function (result) {
    //   //send back the new user data
    //   res.json(result);
    // });
  });

  app.post("/api/trips", function (req, res) {
    db.Trip.create(req.body).then(function (result) {
      res.json(dbAuthor);
    });
  });

  app.post("/api/trips", function (req, res) {
    db.Trip.create({
      trip_name: req.body.trip_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
    })
      .then(function (result) {
        res.json(result);
      });
  });



};
