const { errorHandler } = require("../utils/helpers");
const { Gateway } = require("../models");

async function getGateways(req, res) {
  try {
    const entries = await Gateway.find();
    res.send(entries);
  } catch (error) {
    errorHandler(req, res);
  }
}

module.exports = getGateways;
