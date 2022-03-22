const { v4: uuidv4 } = require("uuid");

function parsePeripheralData(data) {
  return data.map((entry) => ({ uid: Date.now(), ...entry }));
}

function parseGatewayData(data) {
  return {
    serialNumber: uuidv4(),
    name: data.name,
    ipv4Address: data.ipv4Address,
    peripherals: parsePeripheralData(data.peripherals),
  };
}

function errorHandler(req, res) {
  const DEFAULT_MSG =
    "Sorry, we are unable to process your request at this time";
  res.status(500).send(responseMessage({ description: DEFAULT_MSG }));
}

function responseMessage(data) {
  return { message: data };
}

module.exports = {
  parseGatewayData,
  parsePeripheralData,
  errorHandler,
  responseMessage,
};
