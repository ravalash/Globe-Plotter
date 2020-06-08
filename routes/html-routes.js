// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/", (req, res) => {
    if (req.user) {
      res.redirect("/dashboard");
    }
    res.render("index");
  });

  app.get("/signup", (req, res) => {
    if (req.user) {
      res.redirect("/dashboard");
    }
    res.render("signup");
  });

  app.get("/dashboard", isAuthenticated, (req, res) => {
    res.render("dashboard");
  });

  app.get("/edittrip", isAuthenticated, (req, res) => {
    res.render("edittrip");
  });

  app.get("/searchcity", isAuthenticated, (req, res) => {
    res.render("searchcity");
  });

  app.get("/addact", isAuthenticated, (req, res) => {
    res.render("addact");
  });

  app.get("/currenttrip", isAuthenticated, (req, res) => {
    res.render("currenttrip");
  });

  app.get("/comptrip", isAuthenticated, (req, res) => {
    res.render("comptrip");
  });
};
