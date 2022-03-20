const { v4: uuidv4 } = require("uuid");

function parsePeripheralData(data) {
  return data.map((entry) => ({ ...entry, uid: Date.now() }));
}

function parseGatewayData(data) {
  return {
    serialNumber: uuidv4(),
    name: data.name,
    ipv4Address: data.ipv4Address,
    peripherals: parsePeripheralData(data.peripherals),
  };
}

module.exports = {
  parseGatewayData,
  parsePeripheralData,
};
