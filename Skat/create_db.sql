let skat_user_query = `CREATE TABLE IF NOT EXISTS skat_user (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	UserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL,
    IsActive BIT NOT NULL
)`;

db.run(skat_user_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let skat_year_query = `CREATE TABLE IF NOT EXISTS skat_year (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	Label TEXT NOT NULL,
	CreatedAt DATETIME NOT NULL,
	ModifiedAt DATETIME,
    StartDate DATETIME NOT NULL,
    EndDate DATETIME
)`;

db.run(skat_year_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let skat_user_year_query = `CREATE TABLE IF NOT EXISTS skat_user_year (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	SkatUserId INTEGER NOT NULL,
   	SkatYearId INTEGER NOT NULL,
   	UserId INTEGER NOT NULL,
	IsPaid BIT Default 0,
    Amount DECIMAL(2) NOT NULL,
	FOREIGN KEY (SkatUserId) REFERENCES skat_user(Id) ON DELETE CASCADE,
	FOREIGN KEY (SkatYearId) REFERENCES skat_year(Id) ON DELETE CASCADE
)`;

db.run(skat_user_year_query, (err) => {
    if (err) {
        console.log(err);
    }
});

db.close();