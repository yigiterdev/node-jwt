const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.listen(3005);
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

const USERS = [
  {
    username: "user",
    password: "user-123"
  }
];

const REFRESH_TOKENS = [];

const PRODUCTS = [
  {
    id: 1,
    name: "Camera 1",
    description: "Camera 1 description",
    price: 1000,
    currency_symbol: "$",
    arrival_date: "01-01-2020"
  },

  {
    id: 2,
    name: "Camera 2",
    description: "Camera 2 description",
    price: 700,
    currency_symbol: "$",
    arrival_date: "01-03-2020"
  },

  {
    id: 3,
    name: "Camera 3",
    description: "Camera 3 description",
    price: 600,
    currency_symbol: "$",
    arrival_date: "01-05-2020"
  },

  {
    id: 4,
    name: "Camera 4",
    description: "Camera 4 description",
    price: 300,
    currency_symbol: "$",
    arrival_date: "01-07-2020"
  },

  {
    id: 5,
    name: "Camera 5",
    description: "Camera 5 description",
    price: 400,
    currency_symbol: "$",
    arrival_date: "01-09-2020"
  },

  {
    id: 6,
    name: "Camera 6",
    description: "Camera 6 description",
    price: 200,
    currency_symbol: "$",
    arrival_date: "01-11-2020"
  }
];

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const authUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (!authUser) return res.status(400).send("Username or password incorrect");

  const accessToken = generateAccessToken(authUser);
  const refreshToken = jwt.sign(authUser, process.env.REFRESH_TOKEN_SECRET);

  res.json({username, accessToken: accessToken, refreshToken: refreshToken});
});

app.get("/products", authenticateToken, (req, res) => {
  res.json(PRODUCTS);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);

    res.json({accessToken: accessToken});
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = app;
