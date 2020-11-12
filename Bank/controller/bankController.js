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
    const query = `INSERT INTO bank_user(UserId) VALUES(?)`
    res.send('hello world')

    // db.run(query, [bankUserId], (error) => {
    //     if (error){
    //         res.status(400).json({message: 'the user could not get crated, no rows affcted',
    //         error : error.message})
    //         console.log(error)
    //     }
    //     else{
    //         console.log('new values were added to the database ')
    //         res.status(201).json({message:'Rows were succesfully altered '})
    //     }
    // })
}

export const testBankApi = async (req,res) => {
    res.send('hello world')
    console.log('youve been hit BAM! ')
}