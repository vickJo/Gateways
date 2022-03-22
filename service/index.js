const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const controllers = require("./controllers");

const PORT = 5000;
const app = express();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/msoft");

  app
    .use(cors())
    .use(bodyParser.json())
    .get("/gateways", controllers.getGateways)
    .get("/gateways/:id", controllers.getGateway)
    .post("/gateways", controllers.postGateway)
    .patch("/gateways/:id", controllers.patchGateway)
    .delete("/gateways/:id", controllers.deleteGateway)
    .listen(PORT, () => console.log(`listening on port ${PORT}`));
}

main().catch(console.log);
