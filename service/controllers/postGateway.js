const { Gateway } = require("../models");
const { validateGateway } = require("../utils/validation");
const {
  errorHandler,
  responseMessage,
  parseGatewayData,
} = require("../utils/helpers");

async function postGateway(req, res) {
  try {
    const errors = validateGateway(req.body);

    if (Object.keys(errors).length) {
      res.status(400).send(responseMessage({ errors }));
      return;
    }
    const entry = new Gateway(parseGatewayData(req.body));
    await entry.save();
    res.status(201).send({});
  } catch (error) {
    errorHandler(req, res);
  }
}

module.exports = postGateway;
