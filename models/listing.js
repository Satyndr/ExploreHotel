const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required : true
    },
    description: String,
    image : {
        type : String,
        default : "https://unsplash.com/photos/white-and-blue-wooden-house-near-green-trees-during-daytime-4YPxI_c3RgM",
        set : (v) => v === "" ? "https://unsplash.com/photos/white-and-blue-wooden-house-near-green-trees-during-daytime-4YPxI_c3RgM" : v ,
    },
    price : Number,
    location : String,
    country : String,
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;