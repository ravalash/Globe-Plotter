var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  //get trips by user id
  app.get("/api/trips", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.Trip.findAll({
        where: {
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //get trips by user id
  app.get("/api/cities", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.City.findAll({
        where: {
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //get the info for one trip
  app.get("/api/trips/byid/:id", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.Trip.findOne({
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //Get cities by trip id (needed to differentiate this from the cities by city id route)
  app.get("/api/cities/bytrip/:TripId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.City.findAll({
        where: {
          TripId: req.params.TripId,
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //get activities by city
  app.get("/api/activities/:CityId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.Activity.findAll({
        where: {
          CityId: req.params.CityId,
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //find one city by id:
  app.get("/api/cities/:CityId", function (req, res) {
    if (!req.user) {
      console.log("No user!");
      res.json({});
    } else {
      db.City.findOne({
        where: {
          id: req.params.CityId,
          UserId: req.user.id,
        },
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //get user by email for authentication
  app.get("/api/user/:user_email", function (req, res) {
    db.User.findOne({
      where: {
        user_email: req.params.user_email,
        UserId: req.user.id,
      },
    }).then(function (result) {
      res.json(result);
    });
  });

  //post route for creating a new user
  app.post("/api/users", function (req, res) {
    console.log("Post request made");
    console.log(req.body.user_email + " " + req.body.password);
    db.User.create({
      user_email: req.body.user_email,
      password: req.body.password,
    })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  //post route for creating a new trip
  app.post("/api/trips", function (req, res) {
    console.log(req.body.status);
    db.Trip.create({
      trip_name: req.body.trip_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      UserId: req.user.id,
      status: req.body.status,
    }).then(function (result) {
      res.json(result);
    });
  });

  //post route for creating a new city
  app.post("/api/cities", function (req, res) {
    db.City.create({
      city_name: req.body.city_name,
      lat: req.body.lat,
      lon: req.body.lon,
      image: req.body.image,
      status: req.body.status,
      TripId: req.body.TripId,
      UserId: req.user.id,
    }).then(function (result) {
      res.json(result);
    });
  });

  //post route for creating a new activity
  app.post("/api/activities", function (req, res) {
    db.Activity.create({
      activity_name: req.body.activity_name,
      activity_type: req.body.activity_type,
      image: req.body.image,
      yelp: req.body.yelp,
      status: req.body.status,
      CityId: req.body.CityId,
      UserId: req.user.id,
    }).then(function (result) {
      // res.json(result);
      res.redirect("/dashboard");
    });
  });

  //delete route for deleting a user
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({
      where: {
        UserId: req.user.id,
      },
    }).then(function (result) {
      res.json(result);
    });
  });

  //delete route for deleting a trip
  app.delete("/api/trip/:id", function (req, res) {
    db.Trip.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    }).then(function (result) {
      res.json(result);
    });
  });

  //delete route for deleting a city
  app.delete("/api/cities/:id", function (req, res) {
    db.City.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    }).then(function (result) {
      res.json(result);
    });
  });

  //delete route for deleting an activity
  app.delete("/api/activities/:id", function (req, res) {
    db.Activity.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    }).then(function (result) {
      res.json(result);
    });
  });

  //put route for updating user info
  app.put("/api/users", function (req, res) {
    console.log("Update request made");
    db.User.update(
      {
        user_email: req.body.user_email,
        password: req.body.password,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //put route for updating trip info
  app.put("/api/trips/:id", function (req, res) {
    db.Trip.update(
      {
        trip_name: req.body.trip_name,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        status: req.body.status,
      },
      {
        where: {
          UserId: req.user.id,
          id:req.params.id
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //put route for updating all city info
  app.put("/api/cities/:id", function (req, res) {
    db.City.update(
      {
        city_name: req.body.city_name,
        lat: req.body.lat,
        lon: req.body.lon,
        image: req.body.image,
        status: req.body.status,
        TripId: req.body.TripId,
      },
      {
        where: {
          UserId: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //put route for updating all activity info
  app.put("/api/activities/:id", function (req, res) {
    db.Activity.update(
      {
        activity_name: req.body.activity_name,
        activity_type: req.body.activity_type,
        image: req.body.image,
        yelp: req.body.yelp,
        status: req.body.status,
        CityId: req.body.CityId,
      },
      {
        where: {
          UserId: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //update status only routes
  //update city status
  app.put("/api/cities/status/:id", function (req, res) {
    db.City.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });
  //update activity status
  app.put("/api/activities/status/:id", function (req, res) {
    db.Activity.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });
  //update trip status
  app.put("/api/trips/status/:id", function (req, res) {
    db.Trip.update(
      {
        status: req.body.status,
      },
      {
        where: {
          id: req.params.id,
          UserId: req.user.id,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });
};
