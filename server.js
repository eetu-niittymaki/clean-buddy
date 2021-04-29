const express = require('express')
const session = require('express-session')
const cors = require('cors')
const connection = require('./database/connection.js')
const jwt = require('jsonwebtoken')
const router = express.Router()
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

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
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.SECRET_TOKEN, { expiresIn: '1800s' })
}

// Get customers
router.get('/api/customers', async (req, res) => {
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

// Add customer
router.post('/api/customers/', async (req, res) => {
  try {
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const password = req.body.password
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
router.post('/api/suppliers', async (req, res) => {
  try {
    const name = req.body.name
    const supplierDescription = req.body.supplier_description
    const streetAddress = req.body.street_address
    const city = req.body.city
    const postcode = req.body.postcode
    const phone = req.body.phone
    const email = req.body.email
    const password = req.body.password
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
router.post('/api/products', async (req, res) => {
  try {
    const supplierId = req.body.supplier_id
    const productName = req.body.product_name
    const productDescription = req.body.product_description
    const productPrice = req.body.product_price
    const endsAt = req.body.ends_at
    const workHours = req.body.work_hours
    const isAvailable = req.body.is_available
    const results = await connection.saveProduct(
      supplierId,
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

// Add offer request
router.post('/api/offer-requests', async (req, res) => {
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

// Get company specific offer requests
router.get('/api/offer-requests', async (req, res) => {
  try {
    const supplier = req.query.supplier
    const results = await connection.getCompanyOfferRequests(supplier)
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

// Customer login
router.post('/api/auth/signin', async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const results = await connection.customerLogin(email, password)
    if (results.length <= 0) { // No user in db
      await res.status(204).send('User not found')
    } else {
      const token = generateAccessToken({ username: email })
      const jsonToken = res.json(token)
      req.session.loggedin = true // Logs user into session
      req.session.username = email // Session name
      await res.status(200).send({ msg: 'Logged in!', token: jsonToken }) // Token used for saving session login
    }
  } catch (error) {
    res.status(500).send(error)
    console.log(error)
  }
})

router.get('*', function (req, res) {
  res.sendFile(path.resolve('./build/index.html'))
})

module.exports = router
