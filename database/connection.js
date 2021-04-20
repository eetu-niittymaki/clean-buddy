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

  // GET all customers
  static getCustomers () {
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

  // GET all products
  static getProducts () {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query(`SELECT name, product_name, product_description, product_price
                          FROM products
                          INNER JOIN suppliers
                          ON product_id = suppliers.supplier_id`, (err, task) => {
          if (err) throw (err)
          resolve(task)
        })
      } else {
        reject(Error)
      }
    })
  }

  // GET all suppliers
  static getSuppliers () {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query('SELECT name, phone, email FROM suppliers', (err, task) => {
          if (err) throw (err)
          resolve(task)
        })
      } else {
        reject(Error)
      }
    })
  }

  // Add customer to DB
  static saveCustomer (firstName, lastName, streetAddress, city, postcode, phone, email, password) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO customers (${connection.escape(firstName)},
                                            ${connection.escape(lastName)}, 
                                            ${connection.escape(streetAddress)}, 
                                            ${connection.escape(city)}, 
                                            ${connection.escape(postcode)}, 
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

  // Add supplier to DB
  static saveSupplier (name, supplierDescription, streetAddress, city, postcode, phone, email, password) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO suppliers (${connection.escape(name)},
                                            ${connection.escape(supplierDescription)},
                                            ${connection.escape(streetAddress)}, 
                                            ${connection.escape(city)}, 
                                            ${connection.escape(postcode)}, 
                                            ${connection.escape(phone)}, 
                                            ${connection.escape(email)}, 
                                            ${connection.escape(password)})`
        connection.query(sql, () => {
          resolve('Added supplier to database ')
        })
      } else {
        reject(Error)
      }
    })
  }

  // Add product to DB
  static saveProduct (productName, productDescription, productPrice) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO products (${connection.escape(productName)},
                                            ${connection.escape(productDescription)}, 
                                            ${connection.escape(productPrice)})`
        connection.query(sql, () => {
          resolve('Added product to database ')
        })
      } else {
        reject(Error)
      }
    })
  }
}

module.exports = ConnectionFunctions

// curl -X POST 'first_name=Pekka&last_name=PEKKA&address=koti&phone=23124145&email=asda@dd.häh' http://localhost:8080/api
