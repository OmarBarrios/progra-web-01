const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
