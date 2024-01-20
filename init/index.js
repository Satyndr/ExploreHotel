const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing  = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/ExploreHotels";
const MONGO_URL = "mongodb+srv://satyendrakumarcontact:RveBRlWPv8og1UYB@cluster0.imyb8tb.mongodb.net/?retryWrites=true&w=majority";

main().then( ()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj, owner: "658ab88c3d74d0406105b65f"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();