import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const AppliedJobTable = () => {
    useGetAppliedJobs();  // Fetch applied jobs when component mounts

    const allAppliedJobs = useSelector(store => store.job.allAppliedJobs) || []; // Ensure it's always an array

    if (!Array.isArray(allAppliedJobs)) {
        console.error("allAppliedJobs is not an array:", allAppliedJobs);
        return <p className="text-red-500">Error: Applied jobs data is incorrect.</p>;
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.length > 0 ? (
                        allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob?._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                <TableCell>{appliedJob?.job?.title || "Unknown"}</TableCell>
                                <TableCell>{appliedJob?.job?.company?.name || "Unknown"}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={
                                        appliedJob?.status === "rejected" ? 'bg-red-400' : 
                                        appliedJob?.status === 'pending' ? 'bg-gray-400' : 
                                        'bg-green-400'
                                    }>
                                        {appliedJob?.status?.toUpperCase() || "N/A"}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan="4" className="text-center text-gray-500">
                                You haven't applied for any jobs yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable;
