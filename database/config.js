const config = {
  connectionLimit: 10,
  host: 'mydb.tamk.fi',
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

module.exports = config
