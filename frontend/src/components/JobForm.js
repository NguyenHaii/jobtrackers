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
