const dotenv = require('dotenv')
dotenv.config()
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
        connection.query('SELECT * From products', (err, products) => {
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
  static saveProduct (
    supplierId,
    productName,
    productDescription,
    productPrice,
    endsAt,
    workHours,
    isAvailable) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO products(supplier_id, 
                                          product_name, 
                                          product_description, 
                                          product_price,
                                          ends_at,
                                          work_hours,
                                          product_is_available)
                      VALUES (${connection.escape(supplierId)},
                              ${connection.escape(productName)},
                              ${connection.escape(productDescription)}, 
                              ${connection.escape(productPrice)},
                              ${connection.escape(endsAt)},
                              ${connection.escape(workHours)},
                              ${connection.escape(isAvailable)})`
        connection.query(sql, (err, product) => {
          if (err) throw (err)
          resolve(`Added ${productName} to database`)
        })
      } else {
        reject(Error)
      }
    })
  }

  // Add offer request to DB
  static saveOfferRequest (
    apartmentType,
    apartmentArea,
    cleaningFrequency,
    requestSuppliers,
    optionalInformation,
    firstName,
    lastName,
    streetAddress,
    city,
    postcode,
    phone,
    email) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO offer_requests (apartment_type,
                                                 apartment_area,
                                                 cleaning_frequency,
                                                 request_suppliers,
                                                 optional_information,
                                                 first_name,
                                                 last_name,
                                                 street_address,
                                                 city,
                                                 postcode,
                                                 phone,
                                                 email)
                      VALUES (${connection.escape(apartmentType)},
                              ${connection.escape(apartmentArea)}, 
                              ${connection.escape(cleaningFrequency)},
                              ${connection.escape(requestSuppliers)},
                              ${connection.escape(optionalInformation)},
                              ${connection.escape(firstName)},
                              ${connection.escape(lastName)},
                              ${connection.escape(streetAddress)},
                              ${connection.escape(city)},
                              ${connection.escape(postcode)},
                              ${connection.escape(phone)},
                              ${connection.escape(email)})`
        connection.query(sql, (err, offerRequest) => {
          if (err) throw (err)
          resolve('Addes offer request to database')
        })
      } else {
        reject(Error)
      }
    })
  }

  // GET company specific offer requests
  static getCompanyOfferRequests (supplier) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query(`SELECT * FROM offer_requests WHERE request_suppliers LIKE '%${supplier}%'`, (err, offerSupplier) => {
          if (err) throw (err)
          resolve(offerSupplier)
        })
      } else {
        reject(Error)
      }
    })
  }

  static customerLogin (email) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `SELECT * FROM customers WHERE email = ${connection.escape(email)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error('User not found'))
      }
    })
  }
}

module.exports = ConnectionFunctions
