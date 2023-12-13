const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

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

//set-----------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));


//Routing-------------------------------------------------------------------

app.get("/", (req,res)=>{
    res.send("hi root here!");
})

//Index Route
app.get("/listings", async (req,res)=>{

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});

})

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
})

//show route for individual
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
})

//create route
app.post("/listings", async(req,res)=>{
    
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//Edit Route
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
})

//update route
app.put("/listings/:id" , async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delte route
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

//----------------------------------------------------------------

//port listening--------------------------------------------------
app.listen(3000, ()=>{
    console.log("Listening on port ", 3000);
})