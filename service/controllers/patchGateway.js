const { Gateway } = require("../models");
const { validatePeripherals } = require("../utils/validation");
const {
  errorHandler,
  responseMessage,
  parsePeripheralData,
} = require("../utils/helpers");

async function patchGateways(req, res) {
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
}

module.exports = patchGateways;
