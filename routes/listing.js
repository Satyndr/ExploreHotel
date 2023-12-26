const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Index Route
router.get("/", wrapAsync( async (req,res)=>{

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});

}))

//new route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
})

//show route for individual
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}))

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(
    async(req,res,next)=>{
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing created!");
        res.redirect("/listings"); 
    })
)


//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))

//update route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req,res)=>{
    
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}))

module.exports = router;