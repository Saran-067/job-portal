import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import API from "../utils/axiosConfig";
import { JOB_API_END_POINT } from '@/utils/constant';

// Predefined options
const locations = ['Mumbai', 'Chennai', 'Bangalore', 'Pune', 'Hyderabad', 'Delhi'];
const jobTypes = ['Frontend Developer', 'Backend Developer', 'Data Science', 'Graphic Designer', 'FullStack Developer'];
const salaries = [5, 6, 7, 8, 12, 15, 20, 50];
const experienceLevels = ['Fresher', '1-2 years', '3-5 years', '5+ years'];

const PostJob = () => {
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: 0,
        companyId: '',
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector((store) => store.company);

    // Handle input change
    const changeEventHandler = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Dropdown handlers
    const handleSelectChange = (key, value) => {
        setInput((prev) => ({ ...prev, [key]: value }));
    };

    // Submit handler
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.companyId) {
            toast.error("Please select a company before posting a job.");
            return;
        }

        try {
            setLoading(true);
            const res = await API.post(`${JOB_API_END_POINT}/post`, input, { withCredentials: true });

            if (res?.data?.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-screen my-5">
                <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                        {/* Title */}
                        <div>
                            <Label>Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} className="my-1" />
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} className="my-1" />
                        </div>

                        {/* Requirements */}
                        <div>
                            <Label>Requirements</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className="my-1" />
                        </div>

                        {/* Salary */}
                        <div>
                            <Label>Salary (LPA)</Label>
                            <Select value={input.salary} onValueChange={(value) => handleSelectChange("salary", value)}>
                                <SelectTrigger className="w-full my-1">
                                    <SelectValue placeholder="Select Salary" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {salaries.map((salary) => (
                                            <SelectItem key={salary} value={salary.toString()}>{salary} LPA</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location */}
                        <div>
                            <Label>Location</Label>
                            <Select value={input.location} onValueChange={(value) => handleSelectChange("location", value)}>
                                <SelectTrigger className="w-full my-1">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {locations.map((location) => (
                                            <SelectItem key={location} value={location}>{location}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Job Type */}
                        <div>
                            <Label>Job Type</Label>
                            <Select value={input.jobType} onValueChange={(value) => handleSelectChange("jobType", value)}>
                                <SelectTrigger className="w-full my-1">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {jobTypes.map((jobType) => (
                                            <SelectItem key={jobType} value={jobType}>{jobType}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Experience Level */}
                        <div>
                            <Label>Experience Level</Label>
                            <Select value={input.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                                <SelectTrigger className="w-full my-1">
                                    <SelectValue placeholder="Select Experience Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {experienceLevels.map((experience) => (
                                            <SelectItem key={experience} value={experience}>{experience}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Number of Positions */}
                        <div>
                            <Label>Number of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} className="my-1" />
                        </div>

                        {/* Company Selection */}
                        {companies.length > 0 && (
                            <div>
                                <Label>Company</Label>
                                <Select value={input.companyId} onValueChange={(value) => handleSelectChange("companyId", value)}>
                                    <SelectTrigger className="w-full my-1">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company._id}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full my-4" disabled={loading || companies.length === 0}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Post New Job"}
                    </Button>

                    {/* No Company Warning */}
                    {companies.length === 0 && <p className="text-xs text-red-600 font-bold text-center my-3">*Please register a company first.</p>}
                </form>
            </div>
        </div>
    );
};

export default PostJob;
