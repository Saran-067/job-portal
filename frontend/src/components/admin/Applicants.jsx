import React, { useEffect } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import API from "@/utils/axiosConfig";

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await API.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`);
                dispatch(setAllApplicants(res.data.applicants));  // Ensure this matches API response
            } catch (error) {
                console.error("Error fetching applicants:", error.response?.data?.message || error.message);
            }
        };

        if (params.id) {
            fetchAllApplicants();
        }
    }, [params.id]); // Include params.id as dependency

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <h1 className='font-bold text-xl my-5'>Applicants ({applicants?.applications?.length || 0})</h1>
                <ApplicantsTable />
            </div>
        </div>
    );
};

export default Applicants;
