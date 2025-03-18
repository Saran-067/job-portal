import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import api from '../utils/axiosConfig'; // ✅ Using api instead of axios

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await api.get(`${USER_API_END_POINT}/logout`, { withCredentials: true }); // ✅ Replaced axios with api
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className="bg-black text-white shadow-lg">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
                {/* Logo */}
                <div>
                    <h1 className="text-2xl font-bold">
                        Job<span className="text-[#F83002]">hook</span>
                    </h1>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-8">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/companies" className="hover:text-[#F83002] transition-colors duration-300">
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs" className="hover:text-[#F83002] transition-colors duration-300">
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/" className="hover:text-[#F83002] transition-colors duration-300">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/jobs" className="hover:text-[#F83002] transition-colors duration-300">
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Auth Buttons or User Avatar */}
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button className="text-white border border-white hover:bg-[#F83002] hover:border-[#F83002] hover:text-white transition-colors duration-300 px-6 py-2 rounded-md">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-6 py-2 rounded-md transition-colors duration-300">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer hover:opacity-80 transition-opacity duration-300">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Picture" />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-black text-white p-4 rounded-lg border border-gray-700">
                                <div>
                                    {/* User Info */}
                                    <div className="flex gap-4 items-center">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt="Profile Picture" />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullname}</h4>
                                            <p className="text-sm text-gray-400">{user?.profile?.bio}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col mt-4 space-y-2">
                                        {user?.role === 'student' && (
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-[#F83002] transition-colors duration-300">
                                                <User2 className="w-5 h-5" />
                                                <Button variant="link" className="text-white p-0 hover:no-underline">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 cursor-pointer hover:text-[#F83002] transition-colors duration-300" onClick={logoutHandler}>
                                            <LogOut className="w-5 h-5" />
                                            <Button variant="link" className="text-white p-0 hover:no-underline">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
