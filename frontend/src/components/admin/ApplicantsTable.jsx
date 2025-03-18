import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import API from "../utils/axiosConfig";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const [loadingId, setLoadingId] = useState(null); // Track loading state per application

    const statusHandler = async (status, id) => {
        try {
            setLoadingId(id); // Set loading for specific row
            const res = await API.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoadingId(null); // Reset loading
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants?.applications?.length > 0 ? (
                        applicants.applications.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>{item?.applicant?.fullname || "N/A"}</TableCell>
                                <TableCell>{item?.applicant?.email || "N/A"}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                <TableCell>
                                    {item?.applicant?.profile?.resume ? (
                                        <a
                                            className="text-blue-600 cursor-pointer"
                                            href={item?.applicant?.profile?.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item?.applicant?.profile?.resumeOriginalName || "Download"}
                                        </a>
                                    ) : (
                                        <span>NA</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status) => (
                                                <div
                                                    onClick={() => statusHandler(status, item?._id)}
                                                    key={status}
                                                    className={`flex w-fit items-center my-2 cursor-pointer ${
                                                        loadingId === item?._id ? "opacity-50 cursor-not-allowed" : ""
                                                    }`}
                                                    disabled={loadingId === item?._id} // Disable while updating
                                                >
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                                No applicants found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
