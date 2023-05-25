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

const PRODUCTS = [
  {
    id: 1,
    name: "Camera 1",
    description: "Camera 1 description",
    price: 1000,
    currencySymbol: "$",
    arrivalDate: "2020-01-01",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/23c9a2c7-b910-402d-82c5-6fcf34605b13/images/image0_1024_1024_watermark.jpg?Expires=1685104784&Signature=JgfIbWAitTyhRJvTWwT7hxM3dWm3-S8Q5UXwJE7s0Mzw75zd3kN7xDgN4nhMyr~HoaySEmDv55VMFc7YxlcdJrTxklIIvELwPbA9vIu11EpBS2qAVFzsAb1uxaCwDRxyPgT5iivMqzg6cYFL2q5hHDpU8OXI7Gj-DKl3KWgZuxpX6yGOUu9nZZIXK1oTdxzKKoXZJuhiYN81oMs2skFStrZIApit8xW4FLi1V4rS0WDquogBLG1dvKZ18aA167pC304Gtx1rJSvhgYucm4BpaqOUx7MQ0XfJE8tZNLiV0PAKt-0aXgSFUOxCmRTl2-aErcyBE3FnsQGc3Sh6gKY9Eg__&Key-Pair-Id=K3RDDB1TZ8BHT8"
  },

  {
    id: 2,
    name: "Camera 2",
    description: "Camera 2 description",
    price: 700,
    currencySymbol: "$",
    arrivalDate: "2020-01-03",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/23c9a2c7-b910-402d-82c5-6fcf34605b13/images/image1_1024_1024_watermark.jpg?Expires=1685104784&Signature=M4Qm6qsV2FeEtOPl1jo-Bwj-hmX5Gk2-ktUDG8c~MKivi~kd4DRu7h6k35zpIW692SMuBDxASFlpkkZAzZOYfx14FrEIxTtaFrfswWGqYNUyaYbsiu92vbl9xyd0Y3T~D-ZDSk7~a6zPNBqdk7Q6mOk9Qe~T62PvKVBd7kOB1giJMEM9cIN-SaEGcavGvkAln0WYewi24P44Cu0g5OqPQ7biPo8vC37yHeaX~kHRHdvgObEpbFoaIUCDfhZdn-0Aw3-otUibSyG3lbCfWJx5u76Usnlu4vCf9BRX8IFIVLTVeGuroVjWxG7C9pmdU4j0XI-U4Qu9XMR1Npi5tpZ2zw__&Key-Pair-Id=K3RDDB1TZ8BHT8"
  },

  {
    id: 3,
    name: "Camera 3",
    description: "Camera 3 description",
    price: 600,
    currencySymbol: "$",
    arrivalDate: "2020-01-05",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/48564447-e206-4d10-95a3-24f749bf0c22/images/image0_1024_1024_watermark.jpg?Expires=1685104897&Signature=UEN80aJTPWQxmQBhtGB7par-BLTVV13zeswB3nC4ZIArtGyhBV97JURqGksD439Q2qWPqCm50WwUGnVE6nhNSQvHAGsf6dE7pFL-lVkE6usfFt6-~xE22MkYfWSOHsmtjXY7g6SoVqyO7zcojvxxeXE-r9oTcozTgydccKVGVeNzYdmwH8dLDdpsh5Dhf94F0cVwIu6g3RmFFBBilWBFi7akKhwObpIA9KdMsquX8iHUXRajw5cPPXol79pauLFg8MCIOiUbJlIxGY-Gc3DffUEFRU~ccE4CvPjOY-GBDC~oeDUkkou7YkJkEOl2gIF3gvNpZR0CGzE4LKbsjHFW9Q__&Key-Pair-Id=K3RDDB1TZ8BHT8"
  },

  {
    id: 4,
    name: "Camera 4",
    description: "Camera 4 description",
    price: 300,
    currencySymbol: "$",
    arrivalDate: "2020-01-07",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/48564447-e206-4d10-95a3-24f749bf0c22/images/image1_1024_1024_watermark.jpg?Expires=1685104897&Signature=MBJnsM4xfr~Ieur~NgSlooJJadONaiSNTZtheGk9KncjHAnkZSv-W1VmX2pSRbokEG-tJsaub2Yodp9p9vatiY-xgUq1u9KEN7E4TMbmDrjFesUQnYg89-iegmUjyc1dmtGQaswaFjfbfeRmCf07VpsOrbpCZTNm42opJHU~IOLjBylDGDmVtQrpJunyarlvczuz5V1QBRrCBsY-pTv0eOCoGTFD-Kzj5jQgncBNOH~WA5d1pgGvbaEvOYIZxPVwXkt351SJ5L00-6Ot~jOmjsTqacY-cyk3NJO5UMNRmzpaE0IFIL4ReqpbLjVP45WPEVae7m549jstXr3qbuJIOg__&Key-Pair-Id=K3RDDB1TZ8BHT8"
  },

  {
    id: 5,
    name: "Camera 5",
    description: "Camera 5 description",
    price: 400,
    currencySymbol: "$",
    arrivalDate: "2020-01-09",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/b9b8378a-03db-42ec-b90e-2df5725a85dc/images/image0_1024_1024_watermark.jpg?Expires=1685104953&Signature=SCLBUOntg5gWNX~9eJrTE69mPJMrHrFCw74MY40M1KEcotBfszeDNp6N~nV9XEXVLG9A2FD-4~asvcF5MH~r-65ALG7-HWlkfNET5rR8Bm1vJoVSGAfMhG4Kdsf6RJU7e9hJqKRzUEYQQ6~O1-UtT3dh9Awc0Q6GVoL2qMIG2DR0GzrgFZSjmViEzM8gXFcTS84cjLg1dsHkmunhneQcjK8ZKqknsvCChumlqUVg~E85iN2-DwTeEUtRP4FFInHC9-t-X-i4g-drI~fmZ-9j~b3sQmhXPWs8IqBK4Mql8c5dIxIS8KFePB6NXkDvGCBt3hyMaUiDtyW6twQFjdS8lw__&Key-Pair-Id=K3RDDB1TZ8BHT8"
  },

  {
    id: 6,
    name: "Camera 6",
    description: "Camera 6 description",
    price: 200,
    currencySymbol: "$",
    arrivalDate: "2020-01-11",
    imageUrl:
      "https://cdn.gencraft.com/prod/user/dcd8ed28-03fa-4ef3-9003-753b67c0a7b9/b9b8378a-03db-42ec-b90e-2df5725a85dc/images/image1_1024_1024_watermark.jpg?Expires=1685104953&Signature=Js9Cym2FY21Kj-gjaSFyzZNfBay9XaGcuhrCAjdox58NQOyQ8NaSNUyIKzAouB3h9dHtqnhbAFa6qDUcczjDDbB1~OJj2zQFqPz-DZZI4JJlWO7SKgmvvd2vmHtUPNjL8GQZG7qGHWxbwC2iA0Upn9id1DQrZjxtHf1sbZTX8qzCUjGUUDjdP2y0MchUFwyD2a7TleaXJys6QOoScf9~ylWWSnoeO1oJRPJ84w8BYeWGcpQSDGxHK8fkEdij-ro1XLHWj8mqbjgTX6PklvLbBzIbcHgfh56aL-o7-Nc7HRtJZFNmkP1uSSDunWdjUI~YRIphns5pofLtCslXGFKRGQ__&Key-Pair-Id=K3RDDB1TZ8BHT8"
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
  res.json(PRODUCTS);
});

app.get("/products/:id", authenticateToken, (req, res) => {
  const product = PRODUCTS.find((product) => product.id === parseInt(req.params.id));

  if (!product) return res.status(404).send("Product not found");

  res.json(product);
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

module.exports = app;
