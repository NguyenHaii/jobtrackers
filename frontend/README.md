 npm init -y
npm install express mongoose cors
(backend) mkdir routes controllers db models videos
(frontend ) npx create-react-app .

//components
/JobForm.js
import React, { useState, useEffect } from 'react';
import '../styles/JobForm.css';

const JobForm = ({ onSubmit, selectedJob }) => {
  const [form, setForm] = useState({ title: '', company: '', location: '' });

  useEffect(() => {
    if (selectedJob) {
      setForm({
        title: selectedJob.title,
        company: selectedJob.company,
        location: selectedJob.location,
      });
    } else {
      setForm({ title: '', company: '', location: '' });
    }
  }, [selectedJob]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location) {
      alert('All fields are required.');
      return;
    }
    onSubmit(form);
    setForm({ title: '', company: '', location: '' }); // Reset
  };

  return (
    <div className="job-form card">
      <h3 className="section-title">{selectedJob ? 'Edit Job' : 'Add Job'}</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="form-input"
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="form-input"
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="form-input"
        />
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {selectedJob ? 'Update' : 'Add'} Job
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setForm({ title: '', company: '', location: '' })}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;

/JobList.js
import React from 'react';
import '../styles/JobList.css';

const JobList = ({ jobs, onEdit, onDelete }) => (
  <div className="job-list card">
    <h3 className="section-title">Your Applications</h3>
    <table className="job-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Date Posted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job._id}>
            <td>{job.title}</td>
            <td>{job.company}</td>
            <td>{job.location}</td>
            <td>{new Date(job.date_posted).toLocaleDateString()}</td>
            <td className="actions">
              <button className="btn btn-primary" onClick={() => onEdit(job)}>Edit</button>
              <button className="btn btn-danger" onClick={() => onDelete(job._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default JobList;

//services
/JobService.js
import axios from 'axios';

const API = process.env.REACT_APP_API_URL + "/jobs";

export const getAllJobs = () => axios.get(API);
export const getJobById = (id) => axios.get(`${API}/${id}`);
export const addJob = (job) => axios.post(API, job);
export const updateJob = (id, job) => axios.put(`${API}/${id}`, job);
export const deleteJob = (id) => axios.delete(`${API}/${id}`);

/App.js
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

//styles 
/App.css
/* Base body style */
body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(to bottom right, #f5f7fa, #e4e8f0);
  min-height: 100vh;
  padding: 2rem;
}

/* Heading */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #7c3aed;
  text-align: center;
  margin-bottom: 0.5rem;
}

h2 {
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Card (Form + List container) */
.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

/* Form fields */
input, select, textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  outline: none;
  margin-bottom: 1rem;
}

input:focus, select:focus, textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.25);
}

/* Buttons */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  transform: translateY(-2px);
}

/* Search box */
.search-box {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
}

/* Icon styling (optional) */
.icon {
  color: #9ca3af;
  font-size: 1.2rem;
}

/JobForm.css
.job-form {
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4b5563;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
}

.form-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/JobList.css

.job-list {
  margin-top: 1rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.job-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.job-table thead {
  background-color: #f9fafb;
}

.job-table th,
.job-table td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.job-table tr:hover {
  background-color: #f3f4f6;
  transition: background 0.2s ease;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: linear-gradient(to right, #ff6b6b, #ff8e8e);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
}
