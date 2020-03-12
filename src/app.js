const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");


const app = express();
//set up port for heroku or localhost
const port = process.env.PORT || 3000;

//define path for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");


//set up handlerbars engine and views location.
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialPath);

//set up static directory to serve.
app.use(express.static(publicDirPath));


//route handler
app.get("/", (req, res) => {
    res.render("index.hbs", {
        title: "Weather app",
        name: "Bao Nguyen"
    });
});

app.get("/about", (req, res) => {
    res.render("about.hbs", {
        title: "About page",
        name: "Bao Nguyen"
    });
});

app.get("/help", (req, res) => {
    res.render("help.hbs", {
        title: "Help page",
        name: "Bao Nguyen",
        message: "How can I help you",
    });
});


app.get("/weather", (req, res) => {
    if (!req.query.address){
        res.send({
            error: "You must provide an address",
        });
        return;
    }
    geocode(req.query.address, (err, { latitude, longtitude, location } = {}) => {
        if (err){
            res.send({error: err});
            return;
        }
        forecast(latitude, longtitude, (err, forecastData) => {
            if (err){
                res.send({error: err})
                return;
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address,
            });
        });
    });
});




app.get("/help/*", (req, res) => {
    res.render("404.hbs", {
        title: "404",
        errorMessage: "Help article not found!",
        name: "Bao Nguyen",
    });
});

//*: match anything that hasn't been matched so far
app.get("*", (req, res) => {
    res.render("404.hbs", {
        title: "404",
        errorMessage: "Page not found!",
        name: "Bao Nguyen",
    });
});

//listen to port
app.listen(port, () => {
    console.log("Server is up on port " + port + "...");
});



