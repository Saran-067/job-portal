import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                console.log(res.data);
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications)); // Corrected from `application` to `applications`
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        fetchAppliedJobs();

        return () => controller.abort();  // Cleanup function to cancel request on unmount
    }, [dispatch]);

    return { loading, error };  // Optionally return loading/error state
};

export default useGetAppliedJobs;
