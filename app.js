const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const userRouter = require("./routes/user.js");

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

//session
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitiallized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req,res)=>{
    res.send("Hi, I am root!");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local variables-----------------------------------------------------------
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//Routing-------------------------------------------------------------------

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

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