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
    username: "admin",
    password: "admin"
  }
];

const REFRESH_TOKENS = [];

const products = [
  {
    id: 1,
    name: "laptop",
    price: 1000
  },

  {
    id: 2,
    name: "mobile",
    price: 500
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
  REFRESH_TOKENS.push(refreshToken);

  res.json({username, accessToken: accessToken, refreshToken: refreshToken});
});

app.get("/products", authenticateToken, (req, res) => {
  res.json(products);
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);

  if (!REFRESH_TOKENS.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    res.json({accessToken: accessToken});
  });
});

app.delete("/logout", (req, res) => {
  REFRESH_TOKENS = REFRESH_TOKENS.filter((token) => token !== req.body.token);
  res.sendStatus(204);
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
