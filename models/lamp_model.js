var mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  is_lightening: { type: Boolean, required: true }
});
module.exports = mongoose.model("lamps", Schema);
