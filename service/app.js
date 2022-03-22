const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const controllers = require("./controllers");

const app = express();

app
  .use(cors())
  .use(bodyParser.json())
  .get("/gateways", controllers.getGateways)
  .get("/gateways/:id", controllers.getGateway)
  .post("/gateways", controllers.postGateway)
  .patch("/gateways/:id", controllers.patchGateway)
  .delete("/gateways/:id", controllers.deleteGateway);

module.exports = app;
