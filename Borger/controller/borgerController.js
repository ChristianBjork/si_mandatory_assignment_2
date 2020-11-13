
import sqlite3 from 'sqlite3';

let db_file = 'borger_db.sqlite'; 

let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});

export const test = (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 8088... " })
}


export const createBorger = async (req, res) => {
    let userId = req.body.userId;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);
    const create_borger_user = 'INSERT INTO borger_user (Userid, CreatedAt) VALUES (?, ?)';
    db.run(create_borger_user, [userId, createdAt], async (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ errors: ['Could not retrieve photo'] });
        } else {
            console.log("Inserted user: " + userId);
            return res.status(200).send({userID: userId})
        }
    });
}

export const getAllBorger = async (req,res) => {
    const query = 'SELECT * from borger_user'; 
}


function dateBeautifier(date){
    let dateFormatted = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')+' '+
                    [date.getHours(),date.getMinutes(), date.getSeconds()].join(':');
    return dateFormatted;
}