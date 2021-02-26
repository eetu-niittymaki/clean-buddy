const mysql = require('mysql')
const config = require('./config.js')

const connection = mysql.createPool(config)

class ConnectionFunctions {
  static connect () {
    connection.getConnection((err) => {
      if (err) throw err
    })
  }

  static close () {
    connection.end()
  }

  // GET all tasks
  static findAll () {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query('SELECT * FROM customers', (err, task) => {
          if (err) throw (err)
          resolve(task)
        })
      } else {
        reject(Error)
      }
    })
  }

  static save (first_name, last_name, address, phone, email, password) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO customers (${connection.escape(first_name)},
                                            ${connection.escape(last_name)}, 
                                            ${connection.escape(address)}, 
                                            ${connection.escape(phone)}, 
                                            ${connection.escape(email)}, 
                                            ${connection.escape(password)})`
        connection.query(sql, () => {
          resolve('Added customer to database ')
        })
      } else {
        reject(Error)
      }
    })
  }
}

module.exports = ConnectionFunctions

// curl -X POST 'first_name=Pekka&last_name=PEKKA&address=koti&phone=23124145&email=asda@dd.häh' http://localhost:8080/api

// INSERT INTO customers (first_name, last_name, address, phone, email, password)
// VALUES ('liisa', 'jaska', 'koti', '12324', 'hmm@what.com', NULL);
