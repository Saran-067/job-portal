import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button'; 
import { useNavigate } from 'react-router-dom'; 
import { useDispatch } from 'react-redux'; 
import AdminJobsTable from './AdminJobsTable';
import { setSearchJobByText } from '@/redux/jobSlice';
import API from "../utils/axiosConfig";

const AdminJobs = () => {
  const [input, setInput] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all admin jobs
  useEffect(() => {
    const fetchAdminJobs = async () => {
      try {
        const response = await API.get("/job/admin"); // Update endpoint if needed
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error.response?.data?.message || error.message);
      }
    };
    
    fetchAdminJobs();
  }, []);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
        </div>
        {/* Pass fetched jobs to AdminJobsTable */}
        <AdminJobsTable jobs={jobs} />
      </div>
    </div>
  );
};

export default AdminJobs;
