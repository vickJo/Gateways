const strRegex = /\w+/;
const ipRegex =
  /^((\d|([1-9]\d)|(1\d\d)|(2[0-5]{2}))\.){3}(\d|([1-9]\d)|(1\d\d)|(2[0-5]{2}))$/;

const helpers = {
  ipv4: (field, value) => {
    if (!ipRegex.test(value)) {
      return `${field} must be a valid IPv4 address`;
    }
    return true;
  },
  status: (field, value) => {
    if (["online", "offline"].indexOf(value) === -1) {
      return `${field} must be either online or offline`;
    }
    return true;
  },
  string: (field, value) => {
    if (!value || value.length < 2 || !strRegex.test(value)) {
      return `${field} must be a valid name`;
    }
    return true;
  },
};

function validatePeripherals(data) {
  const errors = {};
  const defaultMsg = "Peripherals must be a valid array of devices";

  if (!Array.isArray(data)) {
    errors.peripherals = defaultMsg;
  } else if (data.length > 10) {
    errors.peripherals = "Maximum number of peripheral devices exceeded";
  } else {
    const isValid = data.every(
      ({ vendor, status }) =>
        helpers.string("vendor", vendor) === true &&
        helpers.status("status", status) === true
    );

    if (!isValid) {
      errors.peripherals = defaultMsg;
    }
  }

  return errors;
}

function validateGateway(data) {
  const ipValidation = helpers.ipv4("ipv4Address", data.ipv4Address);
  const nameValidation = helpers.string("name", data.name);
  const peripheralsValidation = validatePeripherals(data.peripherals);
  const errors = {};

  if (ipValidation !== true) {
    errors.ipv4Address = ipValidation;
  }

  if (nameValidation !== true) {
    errors.name = nameValidation;
  }

  if (Object.keys(peripheralsValidation).length) {
    errors.peripherals = peripheralsValidation.peripherals;
  }

  return errors;
}

module.exports = {
  helpers,
  validateGateway,
  validatePeripherals,
};
