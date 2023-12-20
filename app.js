const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

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

//middleware-----------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);     
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


//Routing-------------------------------------------------------------------

app.get("/", (req,res)=>{
    res.send("hi root here!");
})

//Index Route
app.get("/listings", wrapAsync( async (req,res)=>{

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});

}))

//new route
app.get("/listings/new", wrapAsync((req,res)=>{
    res.render("listings/new.ejs");
}))

//show route for individual
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}))

//create route
app.post("/listings", validateListing, wrapAsync(
    async(req,res,next)=>{
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings"); 
    })
)


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

//update route
app.put("/listings/:id" , validateListing, wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        new ExpressError(400, "Send Valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delte route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

//----------------------------------------------------------------

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