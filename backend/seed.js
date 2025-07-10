//controllers
/jobController.js
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

//models
/Job.js
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

//routes
/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;

/ seed.js
const mongoose = require('mongoose');
require('dotenv').config();

// 🔌 Kết nối MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/jobtracker';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    seedJobs();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 🧱 Mô hình Job
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5 },
  company: { type: String, required: true },
  location: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

// 🌱 Hàm chèn dữ liệu mẫu (xoá trước nếu có)
async function seedJobs() {
  try {
    const count = await Job.countDocuments();
    if (count > 0) {
      console.log(`🗑️ Found ${count} existing jobs. Deleting...`);
      await Job.deleteMany();
    }

    const jobs = [
      {
        title: 'Fullstack Developer',
        company: 'Tech Corp',
        location: 'Remote',
      },
      {
        title: 'Frontend Engineer',
        company: 'Designify',
        location: 'Hanoi',
      },
      {
        title: 'Backend Node.js Dev',
        company: 'CloudBase',
        location: 'HCM',
      },
    ];

    await Job.insertMany(jobs);
    console.log('🎉 Seed data inserted successfully!');
  } catch (err) {
    console.error('❌ Error during seed process:', err);
  } finally {
    mongoose.connection.close();
  }
}


/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
