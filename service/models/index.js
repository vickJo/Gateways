const mongoose = require("mongoose");

const { Schema } = mongoose;

const peripheralSchema = new Schema({
  uid: Number,
  vendor: String,
  dateCreated: { type: Date, default: Date.now },
  status: String,
});

const gatewaySchema = new Schema({
  serialNumber: String,
  name: String,
  ipv4Address: String,
  peripherals: [peripheralSchema],
});

const Peripheral = mongoose.model("Peripheral", peripheralSchema);
const Gateway = mongoose.model("Gateway", gatewaySchema);

module.exports = {
  Peripheral,
  Gateway,
};
