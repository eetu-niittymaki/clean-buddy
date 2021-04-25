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
        connection.query('SELECT * FROM customers', (err, customers) => {
          if (err) throw (err)
          resolve(customers)
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
                          ON product_id = suppliers.supplier_id`, (err, products) => {
          if (err) throw (err)
          resolve(products)
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
        connection.query('SELECT supplier_id, name, street_address, city, postcode, phone, email FROM suppliers', (err, suppliers) => {
          if (err) throw (err)
          resolve(suppliers)
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
        const sql = `INSERT INTO customers (first_name, last_name, street_address, city, postcode, phone, email, password)
                     VALUES(${connection.escape(firstName)},
                            ${connection.escape(lastName)}, 
                            ${connection.escape(streetAddress)}, 
                            ${connection.escape(city)}, 
                            ${connection.escape(postcode)}, 
                            ${connection.escape(phone)}, 
                            ${connection.escape(email)}, 
                            ${connection.escape(password)})`
        connection.query(sql, (err, customer) => {
          if (err) throw (err)
          resolve(`Added customer ${firstName} ${lastName} to database`)
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
        const sql = `INSERT INTO suppliers (name, supplier_description, street_address, city, postcode, phone, email, password)
                      VALUES (${connection.escape(name)},
                              ${connection.escape(supplierDescription)},
                              ${connection.escape(streetAddress)}, 
                              ${connection.escape(city)}, 
                              ${connection.escape(postcode)}, 
                              ${connection.escape(phone)}, 
                              ${connection.escape(email)}, 
                              ${connection.escape(password)})`
        connection.query(sql, (err, supplier) => {
          if (err) throw (err)
          resolve(`Added ${supplier} to database`)
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
        const sql = `INSERT INTO products (product_name, product_description, product_price)
                      VALUES (${connection.escape(productName)},
                              ${connection.escape(productDescription)}, 
                              ${connection.escape(productPrice)})`
        connection.query(sql, (err, product) => {
          if (err) throw (err)
          resolve(`Added ${product} to database`)
        })
      } else {
        reject(Error)
      }
    })
  }

  static customerLogin (email, password) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `SELECT * FROM customers WHERE email = ${connection.escape(email)} AND password = ${connection.escape(password)}`
        connection.query(sql, (err, login) => {
          if (err) throw (err)
          resolve(login)
        })
      } else {
        reject(Error('User not found'))
      }
    })
  }
}

module.exports = ConnectionFunctions
