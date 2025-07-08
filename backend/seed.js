// seed.js
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
