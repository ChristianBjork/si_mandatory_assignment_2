const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

let db_file = 'borger_db.sqlite'; 

let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});
var app = express();

app.use(express.json());



app.get('/api/borger/test', (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 5004... " })
});


app.listen(5004, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5004");
    }
});