const config = {
  connectionLimit: 10,
  host: 'mydb.tamk.fi',
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}

module.exports = config
