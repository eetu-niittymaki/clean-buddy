require('dotenv').config()
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bcrypt = require('bcrypt')
const connection = require('./database/connection.js')
const jwt = require('jsonwebtoken')
const router = express.Router()
const path = require('path')

router.use(
  express.json(),
  cors(),
  express.urlencoded({ extended: true }),
  express.static('build'),
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  }
)

// router.use('*', express.static('build'))

/*
// Handles any requests that don't match the ones above
router.get('*', function (req, res) {
  res.sendFile('./build/index.html');
});
*/

router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
)

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.SECRET_TOKEN, { expiresIn: '1800s' })
}

// Get customers
router.get('/api/customers/', async (req, res) => {
  try {
    const results = await connection.getCustomers()
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Get customers
router.get('/api/products/', async (req, res) => {
  try {
    const results = await connection.getProducts()
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Get suppliers
router.get('/api/suppliers/', async (req, res) => {
  try {
    const results = await connection.getSuppliers()
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Get orders
router.get('/api/orders/', async (req, res) => {
  try {
    const results = await connection.getOrders()
    res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Get order items
router.get('/api/order-items/', async (req, res) => {
  try {
    const results = await connection.getOrderItems()
    res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Add customer
router.post('/api/customers/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const password = (req.body.password !== null) ? hashedPassword : null
    const results = await connection.saveCustomer(
      firstName,
      lastName,
      streetAddress,
      city,
      postcode,
      phone,
      email,
      password
    )
    await res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Add supplier
router.post('/api/suppliers/', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const name = req.body.name
    const supplierDescription = req.body.supplier_description
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const password = hashedPassword
    const results = await connection.saveSupplier(
      name,
      supplierDescription,
      streetAddress,
      city,
      postcode,
      phone,
      email,
      password
    )
    await res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Add product
router.post('/api/products/', async (req, res) => {
  try {
    const supplierName = req.body.supplier_name
    const productName = req.body.product_name
    const productDescription = req.body.product_description
    const productPrice = req.body.product_price
    const endsAt = req.body.ends_at
    const workHours = req.body.work_hours
    const isAvailable = req.body.is_available
    const results = await connection.saveProduct(
      supplierName,
      productName,
      productDescription,
      productPrice,
      endsAt,
      workHours,
      isAvailable
    )
    await res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

// Add order
router.post('/api/orders/', async (req, res) => {
  try {
    const customerIdIn = req.body.customer_id_in
    const supplierIdIn = req.body.supplier_id_in
    // const orderIdIn = req.body.order_id_in
    const productIdIn = req.body.product_id_in
    const quantityIn = req.body.quantity_in
    const results = await connection.saveOrder(
      customerIdIn,
      supplierIdIn,
      // orderIdIn,
      productIdIn,
      quantityIn
    )
    res.status(201).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Add offer request
router.post('/api/offer-requests/', async (req, res) => {
  try {
    const apartmentType = req.body.apartment_type
    const apartmentArea = req.body.apartment_area
    const cleaningFrequency = req.body.cleaning_frequency
    const requestSuppliers = req.body.request_suppliers
    const optionalInformation = req.body.optional_information
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const results = await connection.saveOfferRequest(
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
      email
    )
    await res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

// UPDATE customer
router.put('/api/customers/', async (req, res) => {
  try {
    const customerId = req.body.customer_id
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const results = await connection.updateCustomer(
      customerId,
      firstName,
      lastName,
      streetAddress,
      city,
      postcode,
      phone,
      email
    )
    res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
    console.log(error)
  }
})

// UPDATE supplier
router.put('/api/suppliers/', async (req, res) => {
  try {
    const supplierId = req.body.supplier_id
    const name = req.body.name
    const supplierDescription = req.body.supplier_ddescription
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const results = await connection.updateSupplier(
      supplierId,
      name,
      supplierDescription,
      streetAddress,
      city,
      postcode,
      phone,
      email)
    await res.status(201).send(results)
  } catch (error) {
    console.log(error)
  }
})

// UPDATE products
router.put('/api/products/', async (req, res) => {
  try {
    const productId = req.body.product_id
    const productName = req.body.product_name
    const productDescription = req.body.product_description
    const productPrice = req.body.product_price
    const endsAt = req.body.ends_at
    const workHours = req.body.work_hours
    const isAvailable = req.body.is_available
    const results = await connection.updateProduct(
      productId,
      productName,
      productDescription,
      productPrice,
      endsAt,
      workHours,
      isAvailable)
    await res.status(201).send(results)
  } catch (error) {
    console.log(error)
  }
})

// DELETE customer
router.delete('/api/customers/:id([0-9]+)', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const results = await connection.deleteCustomer(id)
    res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// DELETE supplier
router.delete('/api/suppliers/:id([0-9]+)', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const results = await connection.deleteSupplier(id)
    res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Delete offer
router.delete('/api/products/:id([0-9]+)', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const results = await connection.deleteOffer(id)
    res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Get company specific offer requests
router.get('/api/offer-requests/', async (req, res) => {
  try {
    const supplier = req.query.supplier
    const results = await connection.getCompanyOfferRequests(supplier)
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Customer login
router.post('/api/auth/signin/', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const results = await connection.customerLogin(email)
    if (email === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
      res.status(200).send({ admin: true })
    } else {
      if (!results.length) { // Email not found in table.
        res.status(206).send()
      } else {
        const compare = await bcrypt.compare(password, results[0].password)
        if (compare) {
          const token = generateAccessToken({ username: email })
          const customerId = results[0].customer_id
          req.session.loggedin = true // Logs user into session
          req.session.username = email // Session name
          res.status(200).send(({ token: token, userId: customerId, admin: false })) // Token used for saving session login
        } else {
          res.status(204).send('Wrong email/password')
        }
      }
    }
  } catch (error) {
    res.status(500).send(error)
    // console.log(error)
  }
})

// Supplier login
router.post('/api/auth/supplier/', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const results = await connection.supplierLogin(email)
    if (!results.length) { // Email not found
      res.status(206).send()
    } else {
      const compare = await bcrypt.compare(password, results[0].password)
      if (compare) {
        const token = generateAccessToken({ username: results[0].name })
        const supplierId = results[0].supplier_id
        req.session.loggedin = true // Logs user into session
        req.session.username = email // Session name
        res.status(200).send(({ token: token, supplierId: supplierId })) // Token used for saving session login
      } else {
        res.status(204).send('Wrong email/password!')
      }
    }
  } catch (error) {
    res.status(500).send(error)
    // console.log(error)
  }
})

router.get('*', function (req, res) {
  res.sendFile(path.resolve('./build/index.html'))
})

module.exports = router
