const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        //host: 'localhost',
        socketPath: "/tmp/mysql.sock",
        // Your MySQL username,
        user: "root",
        // Your MySQL password
        password: "01ElletcYang!",
        database: "election",
    },
    console.log('Connected to the election database.')

);

db.connect((err) => {
    if (err) {
        return console.error('error ' + err.message);
    }
    console.log("Connected");
});

//Get all candidates from API endpoint
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
        AS party_name
        FROM candidates
        LEFT JOIN parties
        ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

//Gets all candidates to the terminal
// db.query(`SELECT * FROM candidates`, (err, rows)=>{
//     console.log(rows);
// });

//Get a single candidate to terminal
// db.query(`SELECT * FROM candidates WHERE id =1`, (err, row)=>{
//     if (err){
//         console.log(err);
//     }
//     console.log(row);
// });

// Get a single candidate from API endpoint
app.get('/api/candidate/:id', (req, res)=>{
    const sql = `SELECT candidates.*, parties.name
        AS party_name
        FROM candidates
        LEFT JOIN parties
        ON candidates.party_id = parties.id`;

    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});



//Delet a candidate from terminal
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });

//Delete a candidate from API endpoint
// app.delete('/api/candidate/:id', (req,res)=>{
//     const sql =`DELETE FROM candidates WHERE id = ?`;
//     const params = [req.params.id];
//     db.query(sql, params, (err, result)=>{
//         if (err){
//             res.statusMessage(400).json({error: res.message});
//         }else if(!result.affectedRows){
//             res.json({
//                 message: 'Candidate NOT found'
//             });
//         }else{
//             res.json({
//                 message: 'deleted',
//                 changes: result.affectedRows,
//                 id: req.params.id
//             });
//         }
//     });
// });


//Create a candidate from terminal
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// db.query(sql, params, (err, result)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// });

//Create a candidate from api endpoint
app.post('/api/candidate', ({body},res)=>{
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors){
        res.status(400).json({error: errors});
        return;
    }
    const sql = 'INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?, ?, ?)';
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result)=>{
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

