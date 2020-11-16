import Axios from 'axios';
import { query } from 'express';
import  sqlite3 from 'sqlite3';

let db_file = 'bank_db.sqlite'; 

const interesteRateURL ='https://interesteratesforassignment.azurewebsites.net/api/InterRate'
const loanAlgoURL = 'https://loanalgoforsi.azurewebsites.net/api/LoanAlgo'

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
    db.all(queryGetOneDeposit, function (err,result) {
        if (err){
            res.send('Id did not match any ID').status(504)
        }
        else{
            console.log(result)
            res.json(result).status(200)
        }
    })

}

export const createLoan = async (req,res) => {
    const BankUserId = req.body.BankUserId
    const loanAmount = req.body.loanAmount
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
    let modifiedAt = new Date();
    modifiedAt = dateBeautifier(modifiedAt)
    
    const queryLoan = `Select Amount,BankUserId from account where BankUserId=${BankUserId}`
    db.all(queryLoan, function (err,resaults) {
        const userAmount = resaults[0].Amount
        console.log(userAmount)
            Axios.post(`${loanAlgoURL}`,{loanAmount:loanAmount,Amount:userAmount}).then((data) => {
             if (data.status === 200){
                 const insertLoanQuery ='INSERT INTO loan (UserId, CreatedAt, ModefiedAt, Amount) values (?,?,?,?)'
                 db.run(insertLoanQuery,[BankUserId,createdAt,modifiedAt,loanAmount], async function (err) {
                     if (err){
                         console.log(loanAmount)
                         console.log(err)
                         res.status(403).send('there was an error')
                     }
                     else{
                         res.send('the loan was succesfully made').status(200)
                     }
                 })
             }
             }) .catch(function (error) {
                console.log(error);
                res.send('the loan could not be made').status(403)
              })
    })
}

export const payLoan = async (req,res) => {
    const {id} = req.params
    const amountPaid = req.body.Paid
    console.log('our id is ',id)
    const queryFindLoanValues = `Select Id,UserId,Amount from loan where UserId =${id}`
    db.all(queryFindLoanValues,function (err,result) {
        if (err){
            res.send('No match for the given Id').status(403)
            console.log(err)
        }
        else{
            const currentAmount = result[0].Amount
            console.log('current Amount ',currentAmount)
            console.log('amount paid ', amountPaid)
            const newAmount = currentAmount-amountPaid
            const patchQuery = `Update loan SET Amount = ${newAmount}`
            const queryCheckValue = `Select Id,UserId,Amount from loan where UserId =${id}`
            db.run(patchQuery,function (err,result) {
                if(err){
                    console.log(err)
                }
                else{
                    db.all(queryCheckValue,function (err,NewResult) {
                        if(err){
                            console.log('inside check')
                            console.log(err)
                        }
                        else{
                            console.log(NewResult)
                        }
                    })
                }
            })
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

