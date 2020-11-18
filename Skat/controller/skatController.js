import sqlite3 from 'sqlite3';
import axios from 'axios';
//Setup db connection
const db_file = 'skat_db.sqlite'; 
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

//Create User
export const createUser = async (req, res) => {
    const userId = req.body.userId;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);
    const isActive = req.body.isActive;

    const create_query = 'INSERT INTO skat_user (UserId, CreatedAt, IsActive) VALUES (?, ?, ?)';
    db.run(create_query, [userId, createdAt, isActive], async (err) => {
        if(err) {
            return res.status(500).send({ errors: ['SQL-Error:' + err] });
        } else {
            console.log("Inserted user: " + userId);
            return res.status(200).send({msg: `User created with userId: ${userId}`});
        }
    });
}

//Read User
export const readUser = async (req, res) => {
    const id = req.body.id;
console.log(id);

    const read_query = 'SELECT * FROM skat_user WHERE Id=?';
    db.get(read_query, [id], async (err, rows) => {
        if(err) {
            return res.status(500).send({ errors: ['SQL-Error:' + err] });
        } else if (rows !== undefined){
            return res.status(200).send({id: rows.Id, userId: rows.UserId, createdAt: rows.CreatedAt, isActive: rows.IsActive});
        } else {
            return res.status(400).send({BadRequest: "User not found"});
        }
    });
}

//Update User
export const updateUser = async (req, res) => {
    const id = req.params.id;

    const newUserId = req.body.userId;
    const newIsActive = req.body.isActive;

    const update_query = 'UPDATE skat_user SET UserId = ? IsActive = ? WHERE Id = ?';
    db.run(update_query, [newUserId, newIsActive, id], async function(err) {
        if(err) {
            return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) updated: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `User not found, rows updated: ${this.changes}`});
        }
    });
}

//Delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const delete_query = 'DELETE FROM skat_user WHERE Id = ?';
    db.run(delete_query, [id], async function(err) {
        if (err) {
            return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) affected: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `User not found, rows affected: ${this.changes}`});
        }
    });
}

//Create SkatYear & SkatUserYear
export const createSkatYear_UserYear = async (req, res) => {
    let label = req.body.skat_year.label;
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
console.log(createdAt);
    let startDate = req.body.skat_year.startDate;
    let endDate = req.body.skat_year.endDate;


    const create_query = 'INSERT INTO skat_year (Label, CreatedAt, StartDate, EndDate) VALUES (?, ?, ?, ?)';
    db.run(create_query, [label, createdAt, startDate, endDate], async function(err) {
        if(err) {
            return res.status(500).send({ create: ['SQL-Error:' + err] });
        } else {
            const yearId = this.lastID;
            console.log("Inserted year with id: " + yearId);
            let affectedRows = 0;
            const read_skat_id = 'SELECT Id, UserId FROM skat_user';
            db.all(read_skat_id, async (err, rows) => {
                if (err) {
                    return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
                } else {
                    let amount = req.body.skat_user_year.amount;
                    rows.forEach(row => {
                        const create_skat_user_year = 'INSERT INTO skat_user_year (SkatUserId, SkatYearId, UserId, Amount) VALUES (?, ?, ?, ?)';
                        db.run(create_skat_user_year, [row.Id, yearId, row.UserId, amount], async function(err) {
                            if(err){
                                return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
                            }
                        });    
                        affectedRows++; 
                        amount += 2000; 
                    });
                    return res.status(200).send({msg: `SkatYear created: ${createdAt}`, skat_user_year: `Inserted rows: ${affectedRows}`});
                }
            });
        }
    });
}

//Read Year
export const readYear = async (req, res) => {
    const id = req.body.id;
console.log(id);

    const read_query = 'SELECT * FROM skat_Year WHERE Id=?';
    db.get(read_query, [id], async (err, rows) => {
        if(err) {
            return res.status(500).send({ errors: ['SQL-Error:' + err] });
        } else if (rows !== undefined){
            let modifiedAt = (rows.ModifiedAt == null ? 'Not modified yet' : rows.ModifiedAt);
            return res.status(200).send({id: rows.Id, label: rows.Label, createdAt: rows.CreatedAt, modifiedAt: modifiedAt, startDate: rows.StartDate, endDate: rows.EndDate});
        } else {
            return res.status(400).send({BadRequest: "Year not found"});
        }
    });
}

//Update Year
export const updateYear = async (req, res) => {
    const id = req.params.id;

    const newLabel = req.body.label;
    let modifiedAt = new Date();
    modifiedAt = dateBeautifier(modifiedAt);
    const newStartDate = req.body.startDate;
    const newEndDate = req.body.endDate;

    const update_query = 'UPDATE skat_year SET Label = ?, ModifiedAt = ?, StartDate = ?, EndDate = ? WHERE Id = ?';
    db.run(update_query, [newLabel, modifiedAt, newStartDate, newEndDate, id], async function(err) {
        if(err) {
            return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) updated: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Year not found, rows updated: ${this.changes}`});
        }
    });
}

//Delete Year
export const deleteYear = async (req, res) => {
    const id = req.params.id;

    const delete_query = 'DELETE FROM skat_year WHERE Id = ?';
    db.run(delete_query, [id], async function(err) {
        if (err) {
            return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) affected: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Year not found, rows affected: ${this.changes}`});
        }
    });
}

//Pay Taxes
export const payTaxes = async ( req, res ) => {
    const userId = req.body.userId;
    console.log("USERID: " + userId);

    //Get amount from bank account
    axios.post('http://localhost:5005/api/bankAPI/account/getAmount', {userId: userId}).then(response => {
        const paidTaxes_query = 'SELECT Amount FROM skat_user_year WHERE IsPaid = 0 AND UserId = ?';
        db.all(paidTaxes_query, [userId], async(err, rows) => {
            if (err) {
                return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
            } else if ( rows !== undefined) {
                console.log('User with id: ' + userId + ' has unpaid taxes!');
            } else {
                console.log('User with id: ' + userId + ' has paid all his taxes!');
            }
        });

        const amount = response.data.amount;
        console.log('this is skat amount:' + amount);
        
        //Get the tax calculated amount
        //http://localhost:5001/skat/skat_tax_calculator
        axios.post('https://skattaxcalculatorforsi.azurewebsites.net/api/Skat_Tax_calculator', {money: amount}).then(result => {
            const amountPaid = result.data.AmountToBePaid;
            console.log('amount paid: ' + amountPaid);
            const updateAmountIsPaid_query = 'UPDATE skat_user_year SET Amount = ?, IsPaid = 1 WHERE UserId = ?';
            db.run(updateAmountIsPaid_query, [amountPaid, userId], async (err) => {
                if (err) {
                    console.log("SKAT HERE");
                    return res.status(500).send({ errors: [`SQL-Error: ${err}`] });
                } 
            });
            let newAmount = amount - amountPaid;

            //Update the new amount in account table
            axios.patch(`http://localhost:5005/api/bankAPI/account/updateAmount/${userId}`, {newAmount: newAmount}).then(respo => {
                return res.status(200).send({msg: respo.data.msg});
            }).catch(err => {
                if (err) {
                    console.log(err);
                }
            });
        }).catch(err => {
            if (err) {
                console.log(err);
            }
        });
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
}



function dateBeautifier(date){
    let dateFormatted = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')+' '+
                    [date.getHours(),date.getMinutes(), date.getSeconds()].join(':');
    return dateFormatted;
}