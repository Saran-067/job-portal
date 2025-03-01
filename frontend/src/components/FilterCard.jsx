import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const [searchQueries, setSearchQueries] = useState({
        Location: '',
        Industry: '',
        Salary: ''
    });
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    };

    const searchHandler = (filterType, query) => {
        setSearchQueries((prev) => ({ ...prev, [filterType]: query }));
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {filterData.map((data, index) => (
                    <div key={index}>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>

                        {/* Search bar for each filter category */}
                        <input
                            type="text"
                            placeholder={`Search ${data.filterType}...`}
                            className="border p-1 mt-2 w-full rounded-md"
                            value={searchQueries[data.filterType]}
                            onChange={(e) =>
                                searchHandler(data.filterType, e.target.value)
                            }
                        />

                        {/* Filter options */}
                        {data.array
                            .filter((item) =>
                                item.toLowerCase().includes(searchQueries[data.filterType].toLowerCase())
                            )
                            .map((item, idx) => {
                                const itemId = `id${index}-${idx}`;
                                return (
                                    <div className='flex items-center space-x-2 my-2' key={itemId}>
                                        <RadioGroupItem value={item} id={itemId} />
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
