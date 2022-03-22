const { errorHandler, responseMessage } = require("../utils/helpers");
const { Gateway } = require("../models");

async function getGateway(req, res) {
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
}

module.exports = getGateway;
