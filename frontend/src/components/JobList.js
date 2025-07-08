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
