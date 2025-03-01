import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className='bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#333333] text-white py-28'>
            <div className='text-center'>
                {/* Section Title */}
                <div className='flex flex-col gap-6 my-12'>
                    <span className='mx-auto px-6 py-3 rounded-full bg-[#F83002] text-black font-semibold tracking-wide'>
                        Find Your Dream Job, Fast!
                    </span>
                    <h1 className='text-5xl md:text-6xl font-extrabold leading-tight'>
                        Search, Apply, and Unlock <br />
                        Your <span className='text-[#6A38C2]'>Dream Job</span>
                    </h1>
                    <p className='text-lg md:text-xl text-gray-300 mt-6 max-w-3xl mx-auto'>
                        Discover exciting opportunities at top companies. Start your career journey today.
                    </p>
                </div>

                {/* Search Bar */}
                <div className='flex w-full md:w-[45%] lg:w-[40%] mx-auto shadow-2xl border border-transparent rounded-full items-center gap-4 mt-8'>
                    <input
                        type="text"
                        placeholder='What are you looking for?'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-transparent text-white placeholder-gray-400 py-4 px-6 rounded-l-full transition-all focus:ring-2 focus:ring-[#6A38C2] focus:ring-opacity-50'
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white py-3 px-6 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <Search className='h-6 w-6' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
