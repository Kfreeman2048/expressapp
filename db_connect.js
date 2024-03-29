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
        connection.query(`SELECT c.id customer_id, c.first_name, c.last_name, c.age, 
                                a.id address_id, a.street, a.postalcode, a.city, co.name country
                            FROM customer c 
                            JOIN customeraddresses ca ON ca.customer_id = c.id  
                            JOIN address a ON a.id = ca.address_id 
                            JOIN country co ON co.id = a.country_id
                            WHERE c.id = ?;`, [id], (err,rows) => {
            if(err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
}

db.createUserAndAddress = (name, age, street, postalcode, city, country_id) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
            if (err) {
                reject(err.message);
            }
            connection.query(`INSERT INTO address (street, postalcode, city, country_id)
                                VALUES ('${street}', '${postalcode}', '${city}', ${country_id})
                                ON DUPLICATE KEY UPDATE id = id;`, (queryErr, _rows1) => {
                if (queryErr) {
                    connection.rollback(rollbackErr => {
                        if (rollbackErr) {
                            reject(rollbackErr.message);
                        } else {
                            reject(queryErr.message);
                        }
                    });
                }
                connection.query(`INSERT INTO customer (first_name, age) VALUES ('${name}', ${age})`, (queryErr2, rows2) => {
                    if (queryErr2) {
                        connection.rollback(rollbackErr => {
                            if (rollbackErr) {
                                reject(rollbackErr.message);
                            } else {
                                reject(queryErr2.message);
                            }
                        });
                    }
                    connection.query(`INSERT INTO customeraddresses (customer_id, address_id)
                                        SELECT LAST_INSERT_ID(), id
                                        FROM address 
                                        WHERE street = '${street}' AND postalcode = '${postalcode}' AND city = '${city}' AND country_id = ${country_id};`, (queryErr3, _rows3) => {
                        if (queryErr3) {
                            connection.rollback(rollbackErr => {
                                if (rollbackErr) {
                                    reject(rollbackErr.message);
                                } else {
                                    reject(queryErr3.message);
                                }
                            });
                        } else {
                            connection.commit((commitErr) => {
                                if (commitErr) {
                                    reject(commitErr.message);
                                }
                                if (rows2 === undefined) {
                                    reject(err)
                                }
                                else {
                                resolve(rows2.insertId);
                                }
                            });
                        }
                    });
                });
            });
        });
    });
}


db.updateUser = (id, name, age, street, postalcode, city, country_id) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE customer c
                            JOIN customeraddresses ca ON ca.customer_id = c.id  
                            JOIN address a ON a.id = ca.address_id
                            JOIN country co ON co.id = a.country_id
                            SET c.first_name = '${name}', c.age = ${age}, a.street = '${street}', a.postalcode = '${postalcode}', a.city = '${city}' , a.country_id = '${country_id}'
                            WHERE c.id = ${id}`, (err,rows) => {
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
