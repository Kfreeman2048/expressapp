let mysql = require('mysql');

let connection = mysql.createConnection({

});

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

let db = {};
db.getUsers = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM customer ', (err, users) => {
            if (err) {
                return reject(err);
            }
            return resolve(users);
        });
    });
}

db.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM customer WHERE id = ?', [id], (err,rows) => {
            if(err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

db.createUser = (name, age) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO customer (first_name, age) VALUES ('${name}','${age}')`, (err,rows) => {
            if(err) {
                return reject(err);
            }
            return resolve(rows.insertId);
        });
    });
}

module.exports = db;
