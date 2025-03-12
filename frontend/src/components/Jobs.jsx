import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { debounce } from 'lodash'; // For debouncing the search input

const Jobs = () => {
    const { allJobs } = useSelector((store) => store.job); // Get all jobs from Redux store
    const [filterJobs, setFilterJobs] = useState(allJobs); // State for filtered jobs
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [searchQuery, setSearchQuery] = useState(''); // State for search input

    // Debounced search function
    const handleSearch = debounce((query) => {
        const filteredJobs = allJobs.filter((job) =>
            job.title.toLowerCase().includes(query.toLowerCase()) // Filter by job title
        );
        setFilterJobs(filteredJobs); // Update filtered jobs
    }, 300); // 300ms delay

    // Update filterJobs when searchQuery or allJobs changes
    useEffect(() => {
        if (allJobs.length > 0) {
            setIsLoading(false); // Data has been loaded
            handleSearch(searchQuery); // Apply search filter
        }
    }, [allJobs, searchQuery]);

    // Handle search input change
    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query); // Update search query state
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="text-lg font-semibold">Loading jobs...</span>
            </div>
        );
    }

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto mt-5">
                <div className="flex gap-5">
                    {/* Filter Section */}
                    <div className="w-[20%]">
                        <FilterCard />
                    </div>

                    {/* Jobs List */}
                    <div className="flex-1 h-[88vh] overflow-y-auto pb-5 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                        {/* Search Input */}
                        <div className="mb-5">
                            <input
                                type="text"
                                placeholder="Search jobs by title..."
                                value={searchQuery}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Job Listings */}
                        {filterJobs.length <= 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <span className="text-lg font-semibold text-gray-600">
                                    No jobs found matching your criteria.
                                </span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        key={job._id} // Ensure key is unique
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;