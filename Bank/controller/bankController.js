import Axios from 'axios';
import { query } from 'express';
import  sqlite3 from 'sqlite3';

let db_file = 'bank_db.sqlite'; 

const interesteRateURL ='https://interesteratesforassignment.azurewebsites.net/api/InterRate'
const loanAlgoURL = 'https://loanalgoforsi.azurewebsites.net/api/LoanAlgo'
const taxCalculatorURL ='https://skattaxcalculatorforsi.azurewebsites.net/api/Skat_Tax_calculator'

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
    const BankUserId = req.body.BankUserId
    const AccountNo = req.body.AccountNo
    const IsStudent = req.body.IsStudent
    let createdAt = new Date();
    createdAt = dateBeautifier(createdAt);
    let modefiedAt = new Date();
    modefiedAt = dateBeautifier(modefiedAt)
    const InterestRate = req.body.InterestRate
    const Amount = req.body.Amount
    const checkId = req.body.BankUserId

    const queryCreateAccount = `INSERT INTO account (BankUserId, AccountNo, IsStudent, CreatedAt, ModefiedAt, InterestRate, Amount) select ?,?,?,?,?,?,? where not exists(SELECT UserId from bank_user WHERE UserId = ?)`
    db.run(queryCreateAccount,[BankUserId, AccountNo, IsStudent, createdAt, modefiedAt, InterestRate, Amount, checkId],(err) => {
        console.log(checkId)
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

export const deleteAccount = async (req,res) => {
    const {id} = req.params
    const queryDeleteAccount = 'DELETE FROM account WHERE Id = ?';
    db.run(queryDeleteAccount, [id], async function(err) {
        if (err) {
            return res.status(500).send({ errors: ["SQL-Error: ${err}"] });
        } else if (this.changes >= 1) {
            return res.status(200).send({ msg: `Row(s) affected: ${this.changes}`});
        } else {
            return res.status(400).send({BadRequest: `Borger not found, rows affected: ${this.changes}`});
        }
    });
}

export const getOneAccount = async (req,res) => {
    const {id} = req.params
    const queryGetOneAccount = `SELECT * FROM account WHERE Id = ${id}`
    db.all(queryGetOneAccount,function (err,results) {
        if(err){
            console.log(err)
            res.send('no account was found').status(504)
        }
        else{
            res.json(results).status(200)
        }
    });
    
}

export const getAllAccounts = async (req,res) =>{
    const queryGetAll = 'select * from account'
    db.all(queryGetAll,(err,result) =>{
        if(err){
            console.log(err)
            res.send('no accounts were found')
        }
        else{
            res.json(result)
        }
    })
}

export const updateAccount = async (req,res) => {
    const {id} = req.params
    const IsStudent = req.body.IsStudent
    let ModefiedAt = new Date();
    ModefiedAt = dateBeautifier(ModefiedAt)
    const Amount = req.body.Amount

    const queryUpdateAccount = `Update account set IsStudent = ?, ModefiedAt = ?, Amount = ? where id = ?`
    db.run(queryUpdateAccount,[IsStudent,ModefiedAt,Amount,id],(err,result) => {
        if(err){
            console.log(err)
            res.send('No account was found').status(503)
        }
        else{
            res.json(result)
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

export const deleteBankUser = (req,res) => {
    const {id} = req.params
    const queryDeleteBankUser = `Delete from bank_user where id = ${id}`
    db.run(queryDeleteBankUser,(err,resaults) => {
        if (err){
            console.log(err)
            res.send('bank user could not be found').status(504)
        }
        else{
            res.status(200).send('user was deleted')
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
    console.log('our id is ', id)
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
            const patchQuery = `Update loan SET Amount = ${newAmount} where UserId =${id}`
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

export const listLoans = async (req,res) => {
    const {id} = req.params
    const queryGetAllLones = `Select UserId,Amount from loan where UserId = ${id} AND amount >0`
    db.all(queryGetAllLones,function (err,result) {
        console.log(result)
        if(err) {
            console.log(err)
            res.send('No loans could be found').status(500)
        }
        else{
            res.json(result)
        }
    })
}

export const withdrawlMoney = async (req,res) => {
    const {id} = req.params
    const amountToWithdraw = req.body.amountToWithdraw
    let ModefiedAt = new Date();
    ModefiedAt = dateBeautifier(ModefiedAt)
    const queryWithdraw = `select BankUserId, Amount from account where Id = ?`
    db.all(queryWithdraw,[id],(err,result) =>{
        console.log(result[0].Amount)
        if(result[0].Amount >= amountToWithdraw ){  
            const newAmount = result[0].Amount - amountToWithdraw
            console.log(newAmount)
            const querySubtractAmount = 'UPDATE account SET Amount = ?, ModefiedAt = ? WHERE Id = ? '
            db.run(querySubtractAmount,[newAmount,ModefiedAt,id],(err) =>{
                if(err){
                    console.log(err)
                    res.send('error').status(500)
                }
                else{
                    res.send('money sucessfully withdrawn').status(200)
                }
            })
        }
        else{
            res.send('can not withdraw more than you have on your account').status(500)

        }

    })

}

export const getAmountFromUser = async (req,res) => {
    const id = req.body.userId
    const getAmountQuery = 'SELECT Amount FROM account WHERE BankUserId = ?'
    console.log(id)
    db.get(getAmountQuery,[id],(err, result) => {
        if (err){
            console.log('No amount was found on the given UserId')
            res.send('No amount was found on the given UserId').status(404)
        }
        else if(result !== undefined) {
            console.log('amount: ' + result.Amount)
            res.status(200).send({amount: result.Amount});
        } else {
            res.status(403).send({notFound: 'amount not found'})
        }
    })
}

export const updateAmount = async (req, res) => {
    const userId = req.params.id;
    const newAmount = req.body.newAmount;
    const update_query = 'UPDATE account SET Amount = ? WHERE BankUserId = ?';
    console.log(newAmount);
    console.log("ID: "+ userId);
    db.run(update_query, [newAmount, userId], async function(err) {
        if (err){
            console.log('No amount was found on the given UserId')
            res.send('No amount was found on the given UserId').status(404)
        } else {
            console.log('Amount updated, tax was paid!')
            console.log('ændringer: ' + this.changes)
            res.status(200).send({ msg: `Amount updated, and tax was paid!`});
        }
    });
}
export const testBankApi = async (req,res) => {
    // let bank_user_query = `CREATE TABLE IF NOT EXISTS bank_user (
    //     Id INTEGER PRIMARY KEY AUTOINCREMENT,
    //        UserId INTEGER NOT NULL,
    //     CreatedAt DATETIME NOT NULL,
    //     ModifiedAt DATETIME NOT NULL
    // )`;
    
    // db.run(bank_user_query, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    
    // let deposit_query = `CREATE TABLE IF NOT EXISTS deposit (
    //     Id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     BankUserId INTEGER NOT NULL,
    //     CreatedAt DATETIME NOT NULL,
    //     Amount DECIMAL(2) NOT NULL,
    //     FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
    // )`;
        
    // db.run(deposit_query, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    
    // let loan_query = `CREATE TABLE IF NOT EXISTS loan (
    //     Id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     BankUserId INTEGER NOT NULL,
    //     CreatedAt DATETIME NOT NULL,
    //     ModefiedAt DATETIME NOT NULL,
    //     Amount DECIMAL(2) NOT NULL,
    //     FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
    // )`;
        
    // db.run(loan_query, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    
    // let account_query = `CREATE TABLE IF NOT EXISTS account (
    //     Id INTEGER PRIMARY KEY AUTOINCREMENT,
    //     BankUserId INTEGER NOT NULL,
    //     AccountNo INTEGER NOT NULL,
    //     IsStudent BIT NOT NULL,
    //     CreatedAt DATETIME NOT NULL,
    //     ModefiedAt DATETIME,
    //     InterestRate DECIMAL(2) NOT NULL,
    //     Amount DECIMAL(2) NOT NULL,
    //     FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
    // )`;
        
    // db.run(account_query, (err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    
    // db.close();
}
