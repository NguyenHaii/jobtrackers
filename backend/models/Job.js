const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date_posted: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Job', jobSchema);
