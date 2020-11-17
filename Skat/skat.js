import express from 'express';
import cors from 'cors';

import skatRoutes from './routes/routes.js'

var app = express();

app.use(express.json());
app.use(cors());
app.use('/api/skat', skatRoutes);


app.listen(5006, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5006");
    }
});