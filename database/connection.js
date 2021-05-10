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
        connection.query('SELECT * FROM products', (err, products) => {
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
        connection.query('SELECT supplier_id, name, supplier_description, street_address, city, postcode, phone, email FROM suppliers', (err, suppliers) => {
          if (err) throw (err)
          resolve(suppliers)
        })
      } else {
        reject(Error)
      }
    })
  }

  // GET all orders
  static getOrders () {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query('SELECT * FROM orders', (err, orders) => {
          if (err) throw (err)
          resolve(orders)
        })
      } else {
        reject(Error)
      }
    })
  }

  // GET all order items
  static getOrderItems () {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.query('SELECT * FROM order_items', (err, orderItems) => {
          if (err) throw (err)
          resolve(orderItems)
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
    supplierName,
    productName,
    productDescription,
    productPrice,
    endsAt,
    workHours,
    isAvailable) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `INSERT INTO products 
                      SET supplier_id = (SELECT supplier_id 
                                         FROM suppliers
                                         WHERE name = ${connection.escape(supplierName)}), 
                          product_name =         ${connection.escape(productName)}, 
                          product_description =  ${connection.escape(productDescription)}, 
                          product_price =        ${connection.escape(productPrice)},
                          ends_at =              ${connection.escape(endsAt)},
                          work_hours =           ${connection.escape(workHours)},
                          product_is_available = ${connection.escape(isAvailable)}`
        connection.query(sql, (err, product) => {
          if (err) throw (err)
          resolve(`Added ${productName} to database`)
        })
      } else {
        reject(Error)
      }
    })
  }

  // Add order to DB
  static saveOrder (
    supplierIdIn,
    customerIdIn,
    productIdIn,
    quantityIn) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `CALL saveOrder(${connection.escape(supplierIdIn)}, 
                                    ${connection.escape(customerIdIn)}, 
                                    ${connection.escape(productIdIn)}, 
                                    ${connection.escape(quantityIn)})`
        connection.query(sql, (err, order) => {
          if (err) throw (err)
          resolve(order)
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

  // Update customer info if given value is not null, else stay unchanged
  static updateCustomer (
    customerId,
    firstName,
    lastName,
    streetAddress,
    city,
    postcode,
    phone,
    email) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `UPDATE customers 
                     SET 
                         first_name = COALESCE(${connection.escape(firstName)}, first_name),
                         last_name  = COALESCE(${connection.escape(lastName)}, last_name),
                         street_address = COALESCE(${connection.escape(streetAddress)}, street_address),
                         city = COALESCE(${connection.escape(city)}, city),
                         postcode = COALESCE(${connection.escape(postcode)}, postcode),
                         phone = COALESCE(${connection.escape(phone)}, phone),
                         email = COALESCE(${connection.escape(email)}, email)
                     WHERE customer_id = ${connection.escape(customerId)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error)
      }
    })
  }

  // Update supplier info if given value is not null, else stay unchanged
  static updateSupplier (
    supplierId,
    name,
    streetAddress,
    city,
    postcode,
    phone,
    email) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `UPDATE suppliers
                     SET 
                         name = COALESCE(${connection.escape(name)}, name),
                         street_address = COALESCE(${connection.escape(streetAddress)}, street_address),
                         city = COALESCE(${connection.escape(city)}, city),
                         postcode = COALESCE(${connection.escape(postcode)}, postcode),
                         phone = COALESCE(${connection.escape(phone)}, phone),
                         email = COALESCE(${connection.escape(email)}, email)
                     WHERE supplier_id = ${connection.escape(supplierId)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error)
      }
    })
  }

  // Update product info if given value is not null, else stay unchanged
  static updateProduct (
    productId,
    productName,
    productDescription,
    productPrice,
    endsAt,
    workHours,
    isAvailable) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `UPDATE products
                     SET 
                         product_name = COALESCE(${connection.escape(productName)}, product_name),
                         product_description = COALESCE(${connection.escape(productDescription)}, product_description),
                         product_price = COALESCE(${connection.escape(productPrice)}, product_price),
                         ends_at = COALESCE(${connection.escape(endsAt)}, ends_at),
                         work_hours = COALESCE(${connection.escape(workHours)}, work_hours),
                         product_is_available = COALESCE(${connection.escape(isAvailable)}, product_is_available)
                     WHERE product_id = ${connection.escape(productId)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error)
      }
    })
  }

  static deleteCustomer (id) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `DELETE FROM customers WHERE customer_id = ${connection.escape(id)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error)
      }
    })
  }

  static deleteSupplier (id) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `DELETE FROM products WHERE supplier_id = ${connection.escape(id)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error)
      }
    })
  }

  static deleteOffer (id) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `DELETE FROM suppliers WHERE product_id = ${connection.escape(id)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
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

  static supplierLogin (email) {
    return new Promise((resolve, reject) => {
      if (connection) {
        const sql = `SELECT * FROM suppliers WHERE email = ${connection.escape(email)}`
        connection.query(sql, (err, results) => {
          if (err) throw (err)
          resolve(results)
        })
      } else {
        reject(Error('Supplier not found'))
      }
    })
  }
}

module.exports = ConnectionFunctions
