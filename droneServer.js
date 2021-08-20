const express = require('express');
const https = require("https");
const fs = require("fs");
const app = express();
module.exports.app = app;

const cors = require('cors');

const droneHandler = require('./droneHandler')
const mysql = require('mysql');

global.connection = mysql.createConnection({
    host: 'database',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: "cloud"
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));



global.connection.connect();


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