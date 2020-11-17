let borger_user_query = `CREATE TABLE IF NOT EXISTS borger_user (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	UserId INTEGER NOT NULL,
	CreatedAt DATETIME NOT NULL
)`;

db.run(borger_user_query, (err) => {
    if (err) {
        console.log(err);
    }
});

let address_query = `CREATE TABLE IF NOT EXISTS address (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
   	BorgerUserId INTEGER NOT NULL,
    Address TEXT NOT NULL,
	CreatedAt DATETIME NOT NULL,
	IsValid BIT DEFAULT 1,
	FOREIGN KEY (BorgerUserId) REFERENCES borger_user(Id) ON DELETE CASCADE
)`;

db.run(address_query, (err) => {
    if (err) {
        console.log(err);
    }
});