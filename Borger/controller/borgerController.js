
import sqlite3 from 'sqlite3';

//Create db connection
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

//Create borger
export const createBorger = async (req, res) => {
    let userId = req.body.userId;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);
    const create_query = 'INSERT INTO borger_user (Userid, CreatedAt) VALUES (?, ?)';
    db.run(create_query, [userId, createdAt], async (err) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ errors: ['Could not retrieve photo'] });
        } else {
            console.log("Inserted user: " + userId);
            return res.status(200).send({userID: userId});
        }
    });
}

//Read Borger
export const readBorger = async (req, res) => {
    let id = req.body.id;
console.log(id);
    const read_query = 'SELECT * FROM borger_user WHERE Id=?';
    db.get(read_query, [id], async (err, rows) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ errors: ['Could not retrieve photo'] });
        } else if (rows !== undefined){
            //console.log("Borger found: " + rows);
            return res.status(200).send({borgerId: rows.Id, userId: rows.UserId, createdAt: rows.CreatedAt});
        } else {
            console.log("Borger found: " + rows);
            return res.status(400).send({BadRequest: "No borger found"});
        }
    });

}


function dateBeautifier(date){
    let dateFormatted = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')+' '+
                    [date.getHours(),date.getMinutes(), date.getSeconds()].join(':');
    return dateFormatted;
}