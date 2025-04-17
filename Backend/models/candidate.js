const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  resume: {
    data: Buffer,
    contentType: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Screened', 'Shortlisted', 'Rejected'],
    default: 'Screened',
  },
});

module.exports = mongoose.model('Candidate', candidateSchema);
