import { query } from 'express';
import  sqlite3 from 'sqlite3';

let db_file = 'bank_db.sqlite'; 

let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});

export const postBankUser = async (req,res) => {
    let bankUserId = req.body.UserId
    const query = `INSERT INTO bank_user(BankUserId) VALUES(?)`
}

export const testBankApi = async (req,res) => {
    console.log('youve been hit BAM! ')
    res.send('hello world')
}