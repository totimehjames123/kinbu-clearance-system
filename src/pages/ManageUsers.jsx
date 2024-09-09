import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { FaSpinner, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MdOutlineEdit } from 'react-icons/md';
import ReactHotToast from '../components/ReactHotToast';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';
import AddUserModal from './../components/AddUserModal';
import EditUserModal from './../components/EditUserModal';
import DeleteConfirmationModal from './../components/DeleteConfirmationModal';
import SearchField from '../components/SearchField';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';
import getUserRole from '../../utils/getUserRole';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);  
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    if (getUserRole() == "admin"){
        checkIsLoggedInAndNavigate(null, "/login");
    }
    else{
        checkIsLoggedInAndNavigate("/login", "/login");
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/all-users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = (newUser) => {
        fetchUsers()
    };

    const handleEditUser = (updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers?.map((user) =>
                user?._id === updatedUser?._id ? updatedUser : user
            )
        );
    };

    const handleDeleteUser = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/delete-user/${selectedUser._id}`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== selectedUser._id)
            );
            toast.success(response.data.message);
            setDeleteModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const filterUsers = () => {
        if (!searchTerm) {
            setFilteredUsers(users);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = users.filter((user) =>
            user?.fullName?.toLowerCase().includes(lowercasedTerm) ||
            user?.username?.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className='flex text-sm'>
            <ReactHotToast />

            <SideBar isOpenDrawer={isOpenDrawer} />

            <div className='overflow-hidden w-full max-h-screen border'>
                <Header onToggleDrawer={() => setIsOpenDrawer(!isOpenDrawer)} title={"Manage Users"} profilePicture={'/images/user.png'} />
                <div className='p-5 lg:flex md:flex lg:justify-between md:justify-between items-center'>
                    <SearchField
                        placeholder={'Name or Username'}
                        setSearchTerm={setSearchTerm}
                    />
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className='flex items-center gap-x-1 bg-violet-500 text-white rounded-md p-2 text-sm'>
                        <FaPlus /> <span>New User</span>
                    </button>
                </div>
                <div className='overflow-scroll max-h-[75%] w-full'>
                    <table className='w-full h-8'>
                        <thead className='text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope="col" className="px-6 py-3">Username</th>
                                <th scope="col" className="px-6 py-3">Full Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    <td colSpan='6' className='text-center py-4'>
                                        <FaSpinner className='animate-spin text-blue-500 mr-2' />
                                        Loading users...
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers?.map((user) => (
                                    <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={user._id}>
                                        <td className='px-6 py-4'>{user?.username}</td>
                                        <td className='px-6 py-4'>{user?.fullName}</td>
                                        <td className='px-6 py-4'>{user?.email}</td>
                                        <td className='px-6 py-4'>{user?.role}</td>
                                        <td className='px-6 py-4'>{user?.department || '-'}</td>
                                        <td className='px-6 py-4 gap-x-4 flex justify-around items-center'>
                                            <TrashIcon
                                                className='w-10 h-10 bg-gray-100 text-red-500 hover:text-red-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setDeleteModalOpen(true);
                                                }}
                                            />
                                            <MdOutlineEdit
                                                className='w-10 h-10 bg-gray-100 text-blue-500 hover:text-blue-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setEditModalOpen(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='text-center py-4'>
                    {filteredUsers?.length === 0 && !isLoading && (
                        <div className='flex items-center justify-center'>
                            <FaInfoCircle className='text-yellow-400 mr-2' />
                            <p className='text-gray-500'>No users found</p>
                        </div>
                    )}
                </div>
            </div>
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onUserAdded={handleAddUser}
                onUserUpdated={handleAddUser}

            />
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                userData={selectedUser}
                onUserUpdated={handleEditUser}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDeleteConfirm={handleDeleteUser}
                fullName={selectedUser?.fullName}
            />
        </div>
    );
};

export default ManageUsers;
