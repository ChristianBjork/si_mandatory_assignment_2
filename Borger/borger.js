import express from 'express';
<<<<<<< HEAD
import cors from 'cors';

import borgerRoutes from '../Borger/routes/routes.js';
=======
import sqlite3 from 'sqlite3'
import axios from  'axios';
import cors from 'cors';

import borgerRoutes from './routes/routes.js'
>>>>>>> ab63a6df5ed7c4adaeb21ebef7d8b6a3ad7ff04d

var app = express();

app.use(express.json());
<<<<<<< HEAD
app.use(cors());
app.use('/api/borger', borgerRoutes);
=======
app.use(cors())
app.use('/borger',borgerRoutes)



>>>>>>> ab63a6df5ed7c4adaeb21ebef7d8b6a3ad7ff04d


app.listen(5004, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5004");
    }
});