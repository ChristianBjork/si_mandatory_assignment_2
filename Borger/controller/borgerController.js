import sqlite3 from 'sqlite3';

//Setup db connection
const db_file = 'borger_db.sqlite'; 
const db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});

//Enable Constraints
db.get("PRAGMA foreign_keys = ON");

export const test = (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 8088... " })
}

//Create borger
export const createBorger = async (req, res) => {
    const userId = req.body.userId;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);

    const create_query = 'INSERT INTO borger_user (UserId, CreatedAt) VALUES (?, ?)';
    db.run(create_query, [userId, createdAt], async (err) => {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else {
            console.log("Inserted user: " + userId);
            return res.status(200).send({userID: userId});
        }
    });
}

//Read Borger
export const readBorger = async (req, res) => {
    const id = req.body.id;
console.log(id);

    const read_query = 'SELECT * FROM borger_user WHERE Id=?';
    db.get(read_query, [id], async (err, rows) => {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (rows !== undefined){
            return res.status(200).send({borgerId: rows.Id, userId: rows.UserId, createdAt: rows.CreatedAt});
        } else {
            return res.status(400).send({BadRequest: "Borger not found"});
        }
    });
}

//Update Borger
export const updateBorger = async (req, res) => {
    const id = req.params.id;

    const newUserId = req.body.userId;

    const update_query = 'UPDATE borger_user SET UserId = ?, CreatedAt = ? WHERE Id = ?';
    db.run(update_query, [newUserId, newCreatedAt, id], async function(err) {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) updated: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Borger not found, rows updated: ${this.changes}`});
        }
    });
}

//Delete Borger
export const deleteBorger = async (req, res) => {
    const id = req.params.id;

    const delete_query = 'DELETE FROM borger_user WHERE Id = ?';
    db.run(delete_query, [id], async function(err) {
        if (err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) affected: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Borger not found, rows affected: ${this.changes}`});
        }
    });
}

//Create Address
export const createAddress = async (req, res) => {
    const address = req.body.address;
    const borgerUserId = req.body.borgerUserId;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);

    //Set old address to not valid
    const update_isValid_query = 'UPDATE address SET IsValid = 0 WHERE IsValid = 1 AND BorgerUserId = ?';
    db.run(update_isValid_query, [borgerUserId], async(err) => {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        }
    });

    const create_query = 'INSERT INTO address (BorgerUserId, Address, CreatedAt) VALUES (?, ?, ?)';
    db.run(create_query, [borgerUserId, address, createdAt], async function(err) {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (this.changes >= 1) {
            console.log("Inserted address: " + address);
            return res.status(200).send({address: address});
        } else {
            return res.status(400).send({BadRequest: "User with entered id, doesn't exist"});
        }
    });
}


//Read Address
export const readAddress = async (req, res) => {
    const id = req.body.id;
console.log(id);

    const read_query = 'SELECT * FROM address WHERE Id=?';
    db.get(read_query, [id], async (err, rows) => {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (rows !== undefined){
            console.log(rows.IsValid);
            let isActive = (rows.IsValid == "1" ? true : false);
            return res.status(200).send({Address: rows.Address, borgerUserId: rows.BorgerUserId, createdAt: rows.CreatedAt, active: isActive});
        } else {
            return res.status(400).send({BadRequest: "Borger not found"});
        }
    });
}

//Update Address
export const updateAddress = async (req, res) => {
    const Id = req.params.id;

    const borgerUserId = req.body.borgerUserId;
    const address = req.body.address;
    const isValid = req.body.isValid;

    //Set old address to not valid
    const update_isValid_query = 'UPDATE address SET IsValid = 0 WHERE IsValid = 1 AND BorgerUserId = ?';
    db.run(update_isValid_query, [borgerUserId], async(err) => {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        }
    });

    const update_query = 'UPDATE address SET Address = ?, isValid = ? WHERE Id = ?';
    db.run(update_query, [address, isValid, Id], async function(err) {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) updated: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Rows updated: ${this.changes}`});
        }
    });
}

//Delete Address
export const deleteAddress = async (req, res) => {
    const id = req.params.id;
    const delete_query = 'DELETE FROM address WHERE Id = ?';
    db.run(delete_query, [id], async function(err) {
        if (err) {
            return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ addressDeleted: `Row(s) affected: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Rows affected: ${this.changes}`});
        }
    });
}



function dateBeautifier(date){
    let dateFormatted = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')+' '+
                    [date.getHours(),date.getMinutes(), date.getSeconds()].join(':');
    return dateFormatted;
}