let bank_user_query = `CREATE TABLE IF NOT EXISTS bank_user (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	UserId INTEGER NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ModifiedAt DATETIME NOT NULL
)`;

db.run(bank_user_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let deposit_query = `CREATE TABLE IF NOT EXISTS deposit (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BankUserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL,
	Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
)`;
    
db.run(deposit_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let loan_query = `CREATE TABLE IF NOT EXISTS loan (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BankUserId INTEGER NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ModefiedAt DATETIME,
    Amount DECIMAL(2) NOT NULL,
    FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
)`;
    
db.run(loan_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let account_query = `CREATE TABLE IF NOT EXISTS account (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BankUserId INTEGER NOT NULL,
    AccountNo INTEGER NOT NULL,
    IsStudent BIT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    ModefiedAt DATETIME,
    InterestRate DECIMAL(2) NOT NULL,
    Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (BankUserId) REFERENCES bank_user(Id) ON DELETE CASCADE
)`;
    
db.run(account_query, (err) => {
    if (err) {
        console.log(err);
    }
});


query = 'INSERT INTO account (BankUserId,AccountNo,IsStudent,CreatedAt,ModefiedAt,InterestRate,Amount) VALUES (3,3,true,2020-11-13,2020-11-13,2,5400)'
"INSERT INTO deposit(BankUserId,CreatedAt,Amount) VALUES (3,'2020-11-13',2000)"
const query ="INSERT INTO loan(UserId,CreatedAt,ModefiedAt,Amount) VALUES (2,'2020-11-13','2020-11-13',45000)"