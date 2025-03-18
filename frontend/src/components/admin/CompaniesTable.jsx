import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API from "@/utils/axiosConfig";

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filteredCompanies, setFilteredCompanies] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filtered = companies.filter(company => 
            !searchCompanyByText || company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
        );

        if (JSON.stringify(filtered) !== JSON.stringify(filteredCompanies)) {
            setFilteredCompanies(filtered);
        }
    }, [companies, searchCompanyByText]); // ✅ Avoid redundant updates

    return (
        <div>
            <Table>
                <TableCaption>A list of your recently registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCompanies?.map(company => (
                        <TableRow key={company._id}> {/* ✅ Added key */}
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={company.logo || "/default-logo.png"} /> {/* ✅ Fallback for missing logo */}
                                </Avatar>
                            </TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div 
                                            onClick={() => navigate(`/admin/companies/${company._id}`)} 
                                            className='flex items-center gap-2 w-fit cursor-pointer'
                                        >
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
