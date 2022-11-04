const express = require('express'); // Routing Framwork
const widen = express(); // Configure Instance
const fetch = require("node-fetch") // Node fetch, probally not needed 
const PORT = 5555; // Local Only
const cors = require("cors");
widen.use(express.json());  // express use JSON format 
require('dotenv').config()

const keyCount = 3

const whiteList = [// List of Endpoints that are allowed 
    "assets"
]

widen.use(cors())

widen.listen(PORT, () => { // Starts the server, not sure if we actually need this
  console.log(`Server running on port ${PORT}`);
})


widen.options('*', cors());

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

widen.get("/*", async(req,res)=>{ // Main route takes widen query uri as query param

  res.set('Access-Control-Allow-Origin', '*');
  res.set("Access-Control-Allow-Headers", "*")


try{ // Google will throw and error if you do not handle errors


let widenUrl = req.url// grabs everything after "/"
        .slice(1,req.url.length)// removes leading /



let allowed = whiteList.some(element=> {
    return widenUrl.split("/").includes(element) // returns wether or not the address is contains a whiteListed endpoint
})
if(!allowed){
    res.status(403).json("Permission Denied for this Endpoint") // Send the error message
}


let apiIndex = Math.floor(Math.random()*keyCount) + 1 // Picks Random Index
let apiKey = process.env[`API_${apiIndex}`]  // Grabs Key from dotenv
const options = { // Fetch Options
  headers: {
    Authorization: "Bearer" + " " + apiKey, // example : Bearer secretkey
    "Access-Control-Allow-Origin": "*", //allows all users,
    "Content-type": "application/json;charset=UTF-8"
  },
  method: "GET", // Fetch Method
  redirect: "follow", // Redirect Behavior
};
 await fetch(widenUrl, options) // Query Widen Data
                  .then(res=>res.json()) // Converts to JSON format
                  
                  .then((data)=> { // Data object now available
                    res.status(200).json(data)}) // Send the data with a 200 Status
                 .catch((e) => console.error(e));
    

  }
  catch(e){ 
    console.error(e)
    res.status(500).json(e)// Sends the Error message with the 500 Status
  }

})

widen.post("/*", async(req,res)=>{
res.set("Access-Control-Allow-Headers", "*")



try{
  let widenUrl = req.url// grabs everything after "/"
        .slice(1,req.url.length)// removes leading /



let allowed = whiteList.some(element=> {
    return widenUrl.split("/").includes(element) // returns wether or not the address is contains a whiteListed endpoint
})
if(!allowed){
    res.status(403).json("Permission Denied for this Endpoint") // Send the error message
}


let apiIndex = Math.floor(Math.random()*keyCount) + 1 // Picks Random Index
let apiKey = process.env[`API_${apiIndex}`]  // Grabs Key from dotenv

  
  const options= {
    headers: {
    Authorization: "Bearer" + " " + apiKey, // example : Bearer secretkey
    "Access-Control-Allow-Origin": "*", //allows all users
  },
    method: "POST",// fetch method
    redirect: "follow",// redorect behavior
    body: req.body // Passes req.body through
  };
  
  await fetch(widenUrl, options) // Query Widen Data
                  .then(res=>res.json()) // Converts to JSON format
                  .then((data)=> { // Data object now available
                    console.log(data)

                    res.status(200).json(data)}) // Send the data with a 200 Status
    

  }
  catch(e){ 
    res.status(500).json(e)// Sends the Error message with the 500 Status
  }

})

module.exports = {
  widen
}