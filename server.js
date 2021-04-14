const express = require("express");
const session = require("express-session");
const connection = require("./database/connection.js");
const cors = require("cors");
const { request, response } = require("express");
const router = express.Router();

router.use(
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
  express.static("build"),
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  }
);

router.use("*", express.static("build"));

/*
// Handles any requests that don't match the ones above
router.get("*", function (req, res) {
  res.sendFile("./build/index.html");
});
*/

router.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Get customers
router.get("/api/customers", async (req, res) => {
  try {
    const results = await connection.getCustomers();
    await res.status(200).send(results);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get customers
router.get("/api/products", async (req, res) => {
  try {
    const results = await connection.getProducts();
    await res.status(200).send(results);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Get suppliers
router.get("/api/suppliers", async (req, res) => {
  try {
    const results = await connection.getSuppliers();
    await res.status(200).send(results);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.post("/api/customers", async (req, res) => {
  try {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const results = await connection.saveCustomer(
      firstName,
      lastName,
      address,
      phone,
      email,
      password
    );
    await res.status(201).send(results);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Customer login
router.post("api/auth/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
      connection.query(
        `SELECT * FROM customers WHERE email = ${connection.escape(email)}
                                                AND   password = ${connection.escape(
                                                  password
                                                )}`,
        function (error, results, fields) {
          if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = email;
            res.status(200).send({ msg: "Logged in!", token: "test123" }); // Token used for saving session login
          } else {
            error("Incorrect email or password");
          }
          response.end();
        }
      );
    } else {
      response.send("Please enter Email and Password");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
