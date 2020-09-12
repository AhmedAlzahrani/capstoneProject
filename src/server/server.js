// Require Express to run server and routes
let trips = [];
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
//PORT number
const PORT = 1200;

//Listening to PORT
const listening = app.listen(PORT , (req , res) => {
    console.log("Server Running");
    console.log("Running on http://localhost:1200");
})

app.get('/' , (req , res) => {
    res.sendFile('dist/index.html');
})
app.post('/addTrip' , (req , res) => {
    trips.push(req.body);
    console.log(trips);
})