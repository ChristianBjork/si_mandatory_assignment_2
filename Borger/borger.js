import express from 'express';
import sqlite3 form 'sqlite3'
import axios  'axios';
import cors from 'cors';

const borgerRoutes from './routes/borger.js'

var app = express();

app.use(express.json());
app.use(cors())
app.use('/borger',)





app.listen(5004, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5004");
    }
});