import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const initialFilterData = [
    {
        filterType: "Location",
        options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        options: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        options: ["0-40k", "42k-1lakh", "1lakh to 5lakh"]
    },
];

const FilterCard = () => {
    const [filterData, setFilterData] = useState(initialFilterData);
    const [searchFilterQuery, setSearchFilterQuery] = useState('');
    const [searchQueries, setSearchQueries] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        const filteredData = initialFilterData.map(category => ({
            ...category,
            options: category.options.filter(option =>
                option.toLowerCase().includes(searchFilterQuery.toLowerCase())
            )
        }));
        setFilterData(filteredData);
    }, [searchFilterQuery]);

    const searchHandler = (filterType, query) => {
        setSearchQueries((prev) => ({ ...prev, [filterType]: query }));
    };

    const filterChangeHandler = (filterType, value) => {
        setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedFilters));
    }, [selectedFilters, dispatch]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <input
                type='text'
                placeholder='Search filters...'
                className='border p-1 mt-2 w-full rounded-md'
                value={searchFilterQuery}
                onChange={(e) => setSearchFilterQuery(e.target.value)}
            />
            <hr className='mt-3' />
            {filterData.map((data, index) => (
                <div key={index} className='mt-4'>
                    <h1 className='font-bold text-lg'>{data.filterType}</h1>

                    <input
                        type='text'
                        placeholder={`Search ${data.filterType}...`}
                        className='border p-1 mt-2 w-full rounded-md'
                        value={searchQueries[data.filterType] || ''}
                        onChange={(e) => searchHandler(data.filterType, e.target.value)}
                    />

                    <RadioGroup
                        value={selectedFilters[data.filterType] || ''}
                        onValueChange={(value) => filterChangeHandler(data.filterType, value)}
                    >
                        {data.options
                            .filter((item) =>
                                item.toLowerCase().includes((searchQueries[data.filterType] || '').toLowerCase())
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
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
};

export default FilterCard;
