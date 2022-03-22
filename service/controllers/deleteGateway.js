const { errorHandler } = require("../utils/helpers");
const { Gateway } = require("../models");

async function deleteGateway(req, res) {
    try {
      await Gateway.findByIdAndDelete(req.params.id);
      res.status(200).send({});
    } catch (error) {
      errorHandler(req, res);
    }
  }
  
  module.exports = deleteGateway;
  