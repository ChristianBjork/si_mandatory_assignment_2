import express  from'express';
import sqlite3  from 'sqlite3'
import axios  from 'axios';
import bankRoutes from '../Bank/routes/routes.js'

let db_file = 'bank_db.sqlite'; 

let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});

var app = express();

app.use(express.json());
app.use('/bankAPI',bankRoutes)
app.get('/test', (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 8081... " })
});

app.listen(5005, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 8081");
    }
});