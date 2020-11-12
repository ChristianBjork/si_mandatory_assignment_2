
const sqlite3 = require('sqlite3').verbose();

let db_file = 'borger_db.sqlite'; 

let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});

export const getAllBorger = async (req,res) => {
    const query = 'SELECT * from borger_user;
}