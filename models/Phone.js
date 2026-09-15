const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  antutu: {
    type: Number,
    required: true,
  },
  ram: {
    type: Number,
    required: true,
  },
  storage: {
    type: Number,
    required: true,
  },
  battery: {
    type: Number,
    required: true,
  },
  refreshRate: {
    type: Number,
    required: true,
  },
  cameraMP: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Phone', phoneSchema);
