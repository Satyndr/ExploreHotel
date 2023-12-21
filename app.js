const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const app = express();


//Database Connect -----------------------------------------------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/ExploreHotels";

main().then( ()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

//middleware-----------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//Routing-------------------------------------------------------------------
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//error handling middleware---------------------------------------
app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    res.render("error.ejs", {err});
    // res.status(statusCode).send(message);
})

//port listening--------------------------------------------------
app.listen(3000, ()=>{
    console.log("Listening on port ", 3000);
})