const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

router.route("/")
//Index Route
.get(wrapAsync(listingController.index))
//create route
.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
//show route for individual
.get(wrapAsync(listingController.showListings))
//update route
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
//delete route
.delete(isLoggedIn, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;