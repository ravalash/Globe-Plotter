//require express and create a router
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.get("/edittrip", (req, res) => {
    res.render("edittrip");
});

router.get("/searchcity", (req, res) => {
    res.render("searchcity");
});

router.get("/addact", (req, res) => {
    res.render("addact");
});

router.get("/currenttrip", (req, res) => {
    res.render("currenttrip");
});

router.get("/comptrip", (req, res) => {
    res.render("comptrip");
});

module.exports = router;