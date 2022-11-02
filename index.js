const express = require('express'); // Routing Framwork
const widen = express(); // Configure Instance
const fetch = require("node-fetch") // Node fetch, probally not needed 
const PORT = 5555; // Local Only

const apiKeyCount = 3 // Number of Keys In the Secret Manager(-1, zero Indexed)

const whiteList = [// List of Endpoints that are allowed 
    "assets"
]

widen.listen(PORT, () => { // Starts the server, not sure if we actually need this
  console.log(`Server running on port ${PORT}`);
})

widen.get("/*", async(req,res)=>{ // Main route takes widen query uri as query param

try{ // Google will throw and error if you do not handle errors


let widenUrl = req.url// grabs everything after "/"
        .slice(1,req.url.length)// removes leading /



let allowed = whiteList.some(element=> {
    return widenUrl.split("/").includes(element) // returns wether or not the address is contains a whiteListed endpoint
})
if(!allowed){
    res.status(403).json("Permission Denied for this Endpoint") // Send the error message
}


let apiIndex = Math.floor(Math.random()*apiKeyCount) + 1 // Picks Random Index
let apiKey = process.env[`API_${apiIndex}`]  // Grabs Key from dotenv

const options = { // Fetch Options
  headers: {
    Authorization: "Bearer" + " " + apiKey, // example : Bearer secretkey
    "Access-Control-Allow-Origin": "*", //allows all users
  },
  method: "GET", // Fetch Method
  redirect: "follow", // Redirect Behavior
};

 await fetch(widenUrl, options) // Query Widen Data
                  .then(res=>res.json()) // Converts to JSON format
                  .then((data)=> { // Data object now available
                    res.status(200).json(data)}) // Send the data with a 200 Status
    

  }
  catch(e){ 
    res.status(500).json(e)// Sends the Error message with the 500 Status
  }

})

widen.post("/*", async(req,res)=>{
try{
  let widenUrl = req.url// grabs everything after "/"
        .slice(1,req.url.length)// removes leading /



let allowed = whiteList.some(element=> {
    return widenUrl.split("/").includes(element) // returns wether or not the address is contains a whiteListed endpoint
})
if(!allowed){
    res.status(403).json("Permission Denied for this Endpoint") // Send the error message
}


let apiIndex = Math.floor(Math.random()*apiKeyCount) + 1 // Picks Random Index
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
                    res.status(200).json(data)}) // Send the data with a 200 Status
    

  }
  catch(e){ 
    res.status(500).json(e)// Sends the Error message with the 500 Status
  }

})

module.exports = {
  widen
}
