import express from 'express';
import cors from 'cors';

import borgerRoutes from './routes/routes.js'

var app = express();

app.use(express.json());
app.use(cors());
app.use('/api/borger', borgerRoutes);


app.listen(5004, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5004");
    }
});