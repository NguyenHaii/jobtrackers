import React, { useEffect, useState } from 'react';
import { getAllJobs, addJob, updateJob, deleteJob } from './services/JobService';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import './styles/App.css'; // Su đã tạo rồi nè!

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    const res = await getAllJobs();
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddOrUpdate = async (jobData) => {
    if (selectedJob) {
      await updateJob(selectedJob._id, jobData);
    } else {
      await addJob(jobData);
    }
    setSelectedJob(null);
    fetchJobs();
  };

  const handleEdit = (job) => setSelectedJob(job);

  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
          Job Application Tracker
        </h1>

        <JobForm onSubmit={handleAddOrUpdate} selectedJob={selectedJob} />

        <hr className="my-6 border-gray-300" />

        <JobList jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
