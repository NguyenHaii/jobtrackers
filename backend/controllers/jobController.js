const Job = require('../models/Job');

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date_posted: -1 });
    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(job);
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, company, location } = req.body;
    const newJob = new Job({ title, company, location });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!updatedJob) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) return res.status(404).json({ error: 'Job not found' });
    res.status(200).json({ message: 'Job deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid ID' });
  }
};
