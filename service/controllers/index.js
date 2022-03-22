const getGateways = require("./getGateways");
const getGateway = require("./getGateway");
const postGateway = require("./postGateway");
const patchGateway = require("./patchGateway");
const deleteGateway = require("./deleteGateway");

const controllers = {
  getGateways,
  getGateway,
  postGateway,
  patchGateway,
  deleteGateway,
};

module.exports = controllers;
