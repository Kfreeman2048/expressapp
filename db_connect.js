let mysql = require('mysql');
const config = require('./config.js');

const connection = mysql.createConnection(config.db);

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

db.updateUser = (id, name, age) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE customer SET first_name = '${name}', age = '${age}' WHERE id = ${id}`, (err,rows) => {
            if(err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

db.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE ca, c
                            FROM customer.customeraddresses ca 
                            JOIN customer.customer c on c.id = ca.customer_id 
                            WHERE c.id = ?`, [id], (err,rows) => {
            if(err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

module.exports = db;
