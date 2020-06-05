var db = require("../models");

module.exports = function (app) {

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

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

  app.get("/api/activities/:cityId", function (req, res) {
    db.Activity.findAll({
      where: {
        cityId: req.params.cityId
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.get("/api/cities/:tripId/:status", function (req, res) {
    db.City.findAll({
      where: {
        tripId: req.params.tripId,
        status: req.params.status
      }
    }).then(function (result) {
      res.json(result);
    });
  });
  

  app.get("/api/user/:user_email", function (req, res) {
    db.User.findOne({
      where: {
        user_email: req.params.user_email
      }
    }).then(function (result) {
      res.json(result);
    });
  });



  //post route for creating a new user
  app.post("/api/users", function (req, res) {
    console.log("Post request made");
    console.log(req.body);
    db.User.create({
      user_email: req.body.user_email,
      password: req.body.password
    })
      .then(function (result) {
        res.json(result);
      });

  });



  app.post("/api/trips", function (req, res) {
    db.Trip.create({
      trip_name: req.body.trip_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      userId: req.body.userId
    })
      .then(function (result) {
        res.json(result);
      });
  });

  app.post("/api/cities", function (req, res) {
    db.City.create({
      city_name: req.body.city_name,
      lat: req.body.lat,
      lon: req.body.lon,
      image: req.body.image,
      status: req.body.status,
      tripId: req.body.tripId
    })
      .then(function (result) {
        res.json(result);
      });
  });

  app.post("/api/activities", function (req, res) {
    db.Activity.create({
      activity_name: req.body.activity_name,
      activity_type: req.body.activity_type,
      image: req.body.image,
      yelp: req.body.yelp,
      status: req.body.status,
      cityId: req.body.cityId
    })
      .then(function (result) {
        res.json(result);
      });
  });  

  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  app.delete("/api/trip/:id", function(req, res) {
    db.Trip.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });
  
  app.delete("/api/cities/:id", function(req, res) {
    db.City.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });
  
  app.delete("/api/activities/:id", function(req, res) {
    db.Activity.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });

  
  


};
