var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {

  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  app.get("/api/trips/:userId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.Trip.findAll({
        where: {
          UserId: req.user.id
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  app.get("/api/cities/:tripId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.City.findAll({
        where: {
          TripId: req.params.tripId,
          UserId: req.user.id
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  app.get("/api/activities/:cityId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.Activity.findAll({
        where: {
          CityId: req.params.cityId,
          UserID: req.user.id
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  app.get("/api/cities/:tripId/:status", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.City.findAll({
        where: {
          TripId: req.params.tripId,
          status: req.params.status,
          UserID: req.user.id
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  //find one city by id:
  app.get("/api/cities/:cityId", function (req, res) {
    if (!req.user) {
      res.json({});
    } else {
      db.City.findOne({
        where: {
          id: req.params.cityId,
          UserId: req.user.id
        }
      }).then(function (result) {
        res.json(result);
      });
    }
  });

  app.get("/api/user/:user_email", function (req, res) {
    db.User.findOne({
      where: {
        user_email: req.params.user_email,
        id: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });



  //post route for creating a new user
  app.post("/api/users", function (req, res) {
    console.log("Post request made");
    console.log(req.body.user_email + " " + req.body.password);
    db.User.create(
      {
        user_email: req.body.user_email,
        password: req.body.password
      }
      // req.body
    )
      .then(function (result) {
        res.json(result);
      });

  });



  app.post("/api/trips", function (req, res) {
    db.Trip.create({
      trip_name: req.body.trip_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      UserId: req.user.id
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
      TripId: req.body.tripId,
      UserId: req.user.id
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
      CityId: req.body.cityId,
      UserId: req.user.id
    })
      .then(function (result) {
        res.json(result);
      });
  });

  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({
      where: {
        id: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.delete("/api/trip/:id", function (req, res) {
    db.Trip.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.delete("/api/cities/:id", function (req, res) {
    db.City.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.delete("/api/activities/:id", function (req, res) {
    db.Activity.destroy({
      where: {
        id: req.params.id,
        UserId: req.user.id
      }
    }).then(function (result) {
      res.json(result);
    });
  });

  app.put("/api/users", function (req, res) {
    console.log("Update request made");
    db.User.update(
      {
        user_email: req.body.user_email,
        password: req.body.password
      }, {
      where: {
        id: req.user.id
      }
    }
    )
      .then(function (result) {
        res.json(result);
      });

  });



  app.put("/api/trips/:id", function (req, res) {
    db.Trip.update({
      trip_name: req.body.trip_name,
      start_date: req.body.start_date,
      end_date: req.body.end_date

    }, {
      where: {
        UserId: req.user.id
      }
    }
    )
      .then(function (result) {
        res.json(result);
      });
  });

  app.put("/api/cities/:id", function (req, res) {
    db.City.update({
      city_name: req.body.city_name,
      lat: req.body.lat,
      lon: req.body.lon,
      image: req.body.image,
      status: req.body.status,
      TripId: req.body.tripId
    }, {
      where: {
        UserId: req.user.id
      }
    })
      .then(function (result) {
        res.json(result);
      });
  });

  app.put("/api/activities/:id", function (req, res) {
    db.Activity.update({
      activity_name: req.body.activity_name,
      activity_type: req.body.activity_type,
      image: req.body.image,
      yelp: req.body.yelp,
      status: req.body.status,
      CityId: req.body.cityId
    }, {
      where: {
        UserId: req.user.id
      }
    })
      .then(function (result) {
        res.json(result);
      });
  });


  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });


};
