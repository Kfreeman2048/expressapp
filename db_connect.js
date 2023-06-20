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
};

module.exports = db;
