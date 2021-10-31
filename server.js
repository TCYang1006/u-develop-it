const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', apiRoutes);

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

//Delet a candidate from terminal
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
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


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

