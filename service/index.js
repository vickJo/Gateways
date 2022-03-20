const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Gateway } = require("./models");
const { validateGateway, validatePeripherals } = require("./utils/validation");
const { parseGatewayData, parsePeripheralData } = require("./utils/helpers");

const PORT = 5000;
const app = express();

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/msoft");
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/gateways", async (req, res) => {
    try {
      const entries = await Gateway.find();
      res.send(entries);
    } catch (error) {
      errorHandler(req, res);
    }
  });

  app.get("/gateways/:id", async (req, res) => {
    try {
      const entry = await Gateway.findById(req.params.id);

      if (entry) {
        res.send(entry);
      } else {
        description = "Gateway not found";
        res.status(404).send(responseMessage({ description }));
      }
    } catch (error) {
      errorHandler(req, res);
    }
  });

  app.post("/gateways", async (req, res) => {
    try {
      const errors = validateGateway(req.body);

      if (Object.keys(errors).length) {
        res.status(400).send(responseMessage({ errors }));
        return;
      }
      const entry = new Gateway(parseGatewayData(req.body));
      await entry.save();
      res.status(201).send();
    } catch (error) {
      errorHandler(req, res);
    }
  });

  app.patch("/gateways/:id", async (req, res) => {
    try {
      const errors = validatePeripherals(req.body.peripherals);

      if (Object.keys(errors).length) {
        res.status(400).send(responseMessage({ errors }));
        return;
      }

      const entry = await Gateway.findByIdAndUpdate(
        req.params.id,
        {
          peripherals: parsePeripheralData(req.body.peripherals),
        },
        { new: true }
      );

      res.status(200).send(entry);
    } catch (error) {
      errorHandler(req, res);
    }
  });

  app.delete("/gateways/:id", async (req, res) => {
    try {
      await Gateway.findByIdAndDelete(req.params.id);
      res.status(200).send();
    } catch (error) {
      errorHandler(req, res);
    }
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

function errorHandler(req, res) {
  const DEFAULT_MSG =
    "Sorry, we are unable to process your request at this time";
  res.status(500).send(responseMessage({ description: DEFAULT_MSG }));
}

function responseMessage(data) {
  return { message: data };
}

main().catch(console.log);
