const express = require('express')
const connection = require('./database/connection.js')
const cors = require('cors')
const router = express.Router()

router.use(express.json(), cors(), express.static('build'), (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// Get all tasks
router.get('/api/', async (req, res) => {
  try {
    const results = await connection.findAll()
    await res.status(200).send(results)
  } catch (error) {
    res.status(404).send(error)
  }
})

router.post('/api/', async (req, res) => {
  try {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const address = req.body.address
    const phone = req.body.phone
    const email = req.body.email
    const password = req.body.password
    const results = await connection.save(first_name, last_name, address, phone, email, password)
    await res.status(201).send(results)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
