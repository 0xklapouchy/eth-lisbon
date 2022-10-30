const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.EA_PORT || 8080;

var server = app.listen();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./api/kyc")();
app.use("/kyc", routes);

var routes = require("./api/whitelist")();
app.use("/whitelist", routes);

app.listen(port, () => console.log(`Listening on port ${port}!`));
