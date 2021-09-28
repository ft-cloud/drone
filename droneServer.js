const express = require('express');
const https = require("https");
const fs = require("fs");
const app = express();
module.exports.app = app;


const { MongoClient } = require("mongodb");
const uri = `mongodb://root:${process.env.MYSQL_ROOT_PASSWORD}@mongo:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false`
const client = new MongoClient(uri);

client.connect().then(()=> {
    global.database = client.db("cloud");

})

const cors = require('cors');

const droneHandler = require('./droneHandler')


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(cors());

app.get("/api/v1/drone",(req, res) => {
    res.send(JSON.stringify({microService:"Drone"}))
})

app.listen(3000, () => {
    console.log(`Drone app listening at http://localhost:3000`);
});


droneHandler.init();

app.use(function (req, res) {
    res.status(404).send('Something went wrong! Microservice: Drone');
});