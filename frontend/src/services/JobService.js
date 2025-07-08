import axios from 'axios';

const API = process.env.REACT_APP_API_URL + "/jobs";

export const getAllJobs = () => axios.get(API);
export const getJobById = (id) => axios.get(`${API}/${id}`);
export const addJob = (job) => axios.post(API, job);
export const updateJob = (id, job) => axios.put(`${API}/${id}`, job);
export const deleteJob = (id) => axios.delete(`${API}/${id}`);
