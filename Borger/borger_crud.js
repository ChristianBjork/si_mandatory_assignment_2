const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

let db = new sqlite3.Database('borger_db.sqlite', (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to nemID database succesfull.');
    }
});
var app = express();

app.use(express.json());



app.get('/test', (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 8080... " })
});


app.listen(8080, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 8080");
    }
});