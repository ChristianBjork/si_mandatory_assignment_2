import express  from'express';
import bankRoutes from '../Bank/routes/routes.js'
import cors from 'cors';

var app = express();

app.use(express.json());

app.use('/api/bankAPI',bankRoutes)
app.use(cors());
app.get('/test', (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 5005..." });
});

app.listen(5005, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 5005...");
    }
});