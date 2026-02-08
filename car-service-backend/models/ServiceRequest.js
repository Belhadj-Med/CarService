const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  carType: { type: String, required: true },
  carModel: { type: String, required: true },
  engine: { type: String, required: true },
  oilType: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
