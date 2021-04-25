const express = require('express')
const app = express()
const cors = require('cors')

const server = require('./server.js')
const database = require('./database/connection.js')

// app.use(server, cors())

app.use(cors())
app.use(server)
// app.use(express.static("public"))

const port = process.env.PORT || 8080

// Start server
const getConnection = app.listen(port, async () => {
  try {
    await database.connect()
    console.log('Connection succesful')
    console.log(`Listening to port ${getConnection.address().port}`)
  } catch (err) {
    console.log(err)
    await getConnection.close()
  }
})
