import Axios from 'axios';
import { query } from 'express';
import  sqlite3 from 'sqlite3';

let db_file = 'bank_db.sqlite'; 

const interesteRateURL ='https://interesteratesforassignment.azurewebsites.net/api/InterRate'

function dateBeautifier(date){
    let dateFormatted = [date.getFullYear(), date.getMonth()+1, date.getDate()].join('-')+' '+
                    [date.getHours(),date.getMinutes(), date.getSeconds()].join(':');
    return dateFormatted;
}
let db = new sqlite3.Database(db_file, (err) => {
    if(err){
        console.log('Failed Connection: ' + err.message);
    } else {
        console.log('Connection to ' + db_file + ' database succesfull.');
    }
});
//Enable Constraints
db.get("PRAGMA foreign_keys = ON");

export const postAccount = async (req,res) => {
    const BankUserId = req.body.Id
    const AccountNo = req.body.AccountNo
    const IsStudent = req.body.IsStudent
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
    let modifiedAt = new Date();
    modifiedAt = dateBeautifier(modifiedAt)
    const InterestRate = req.body.InterestRate
    const Amount = req.body.Amount

    const queryCreateAccount = `INSERT INTO account (BankUserId, AccountNo, IsStudent, CreatedAt, ModefiedAt, InterestRate, Amount) VALUES(?, ?, ?, ?, ?, ?, ?)`
    db.run(queryCreateAccount,[BankUserId, AccountNo, IsStudent, createdAt, modifiedAt, InterestRate, Amount],(err) => {
        if (err) {
            console.log(BankUserId)
            res.send('it failed horribly').status(500)
            console.log(err)
        }
        else{
            res.send('it worked!').status(200)
        }
    })

}
    

export const postBankUser = async (req,res) => {
    const UserId = req.body.UserId
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
    let modifiedAt = new Date();
    modifiedAt = dateBeautifier(modifiedAt)
    const bankUserId = req.body.UserId

    const  queryBankUser = 'INSERT INTO bank_user (UserId,CreatedAt,ModifiedAt) select ?,?,? where not exists(SELECT BankUserId from account WHERE BankUserId = ?)'
    db.run(queryBankUser,[UserId,createdAt,modifiedAt,bankUserId], async function (err) {
        if(err) {
            console.log(err)
            res.send('fuck you i failed').status(500)
        }
        else if(this.changes >= 1){

            return res.send('Bank user succesfully added').status(200)
         }
         else{
                 res.send('Bank user could not be created, due to already having an account ').status(400)
         }
    })
}


export const addDeposit = async (req,res) => {
    const BankUserId = req.body.BankUserId
    const Amount = req.body.Amount
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
    const queryAddDeposit = 'INSERT INTO deposit(BankUserId,CreatedAt,Amount) values(?,?,?)'
    if (Amount >= 1 && Amount != null){

        Axios.post(`${interesteRateURL}`,{amount:Amount}).then((data) =>
             db.run(queryAddDeposit,[BankUserId,createdAt,data.data]) 
        )
        console.log('Deposit succesfully made!')
        res.send('Deposit succesfully made!').status(200)
    }
    else {
        console.log('Could not insert into Database')
        res.send('Could not insert into Database').status(500)
    }
}

export const getOneDeposit = async (req,res) => {
    const {id} = req.params;
    const queryGetOneDeposit = `Select * from deposit where BankUserId = ${id}` 
    console.log(id) 
    db.all(queryGetOneDeposit, function (err,result,fields) {
        if (err){
            res.send('Id did not match any ID').status(504)
        }
        else{
            console.log(result)
            res.json(result).status(200)
        }
    })

}

export const testBankApi = async (req,res) => {
    // let createdAt = new Date();
    // createdAt = dateBeautifier(createdAt);
    // let modifiedAt = new Date();
    // modifiedAt = dateBeautifier(modifiedAt)
    // let UserId = 4
    // console.log('youve been hit BAM! ')
    // res.send('hello world')
    // const queryTest = `INSERT INTO bank_user (UserId ,CreatedAt, ModifiedAt) Values(?,?,?)`
    // db.run(queryTest,[UserId,createdAt,modifiedAt],async (err) => {
    //     console.log(err)
    // })
}

