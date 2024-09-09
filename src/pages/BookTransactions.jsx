import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { FaSpinner, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MdMarkChatRead, MdMarkChatUnread, MdOutlineEdit } from 'react-icons/md';
import ReactHotToast from '../components/ReactHotToast';
import toast from 'react-hot-toast';
import AddStudentModal from './../components/AddStudentModal';
import EditTransactionModal from './../components/EditTransactionModal';
import DeleteConfirmationModal from './../components/DeleteConfirmationModal';
import SearchField from '../components/SearchField';
import StudentDetailsModal from './../components/StudentDetailsModal';
import getUserRole from '../../utils/getUserRole';
import getUserDepartment from '../../utils/getUserDepartment';
import { departmentOptions } from '../../utils/constants';
import FilterComponent from '../components/FilterComponent';
import { formatDate } from '../../utils/formatDate';
import SmallCard from '../components/SmallCard';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

const BookTransactions = () => {
    const [students, setStudents] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditTransactionModalOpen, setEditTransactionModal] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [filters, setFilters] = useState([]);
    
    // console.log("som data", (selectedTransaction))

    const userRole = getUserRole();

    if (getUserRole() == "admin"){
        checkIsLoggedInAndNavigate(null, "/login");
    }
    else if (getUserRole() == "hod"){
        checkIsLoggedInAndNavigate("/login", "/login");
    }
    else if (getUserRole() == "bookshop" || getUserRole() === "librarian"){
        checkIsLoggedInAndNavigate(null, "/login");
    }
    else{
        checkIsLoggedInAndNavigate("/login", "/login");
    }


    const booksReturned = filteredTransactions.filter(transaction => transaction.status === "returned").length
    console.log(booksReturned)
    
    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (userRole == 'admin') {
            // Include department filter only for roles other than 'hod'
            setFilters([
                {
                    id: 'department',
                    label: 'Department',
                    options: departmentOptions,
                    value: null,
                    isMulti: false,
                },
                {
                    id: 'origin',
                    label: 'Origin',
                    options: [],
                    value: null,
                    isMulti: false,
                },
                {
                    id: 'startYear',
                    label: 'Start Year',
                    options: [],
                    value: null,
                    isMulti: false,
                }
            ]);
        } else if (userRole == "bookshop" || userRole == "librarian") {
            setFilters([
                {
                    id: 'department',
                    label: 'Department',
                    options: departmentOptions,
                    value: null,
                    isMulti: false,
                },
                {
                    id: 'startYear',
                    label: 'Start Year',
                    options: [],
                    value: null,
                    isMulti: false,
                }
            ]);
        }
    }, [userRole]);

    useEffect(() => {
        filterStudents();
    }, [students, searchTerm, filters]);

    const handleUpdateStatus = async (transactionId, status) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-transaction-status/`, { transactionId, status });
            toast.success(response.data.message);
            fetchTransactions(); // Refresh the transaction list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update status');
        }
    };
    


    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/all-transactions`);
            let allStudents = Array.isArray(response.data.transactions) ? response.data.transactions : [];
            // console.log(response)
            let getOrigin;

            const role = getUserRole();
            if (role === 'librarian' || role === "bookshop") {
            
            if (role == "librarian"){
                getOrigin = "library"
            }
            else if (role == "bookshop"){
                getOrigin = "bookshop"
            }
            console.log( "get orgin" + getOrigin)
                // const department = getUserDepartment();
                allStudents = allStudents.filter(transaction => transaction.origin === getOrigin);
            }

            // Update state with the filtered or unfiltered list of students
            setStudents(allStudents);

            // Extract start years
            const startYears = Array.from(new Set(allStudents.map(transaction => transaction.studentId.startYear)))
                .filter(year => year); // Remove any undefined or null values
            console.log("startyear" + startYears.length)
            // Update filters state with extracted start years
            setFilters(prevFilters =>
                prevFilters.map(filter =>
                    filter.id === 'startYear'
                        ? { ...filter, options: startYears.map(start => ({ label: start, value: start })) }
                        : filter
                )
            );

            // console.log("filter fo startyear", filters)

            const origin = Array.from(new Set(allStudents.map(transaction => transaction?.origin)))
                .filter(origin => origin); // Remove any undefined or null values
            
            // Update filters state with extracted start years
            setFilters(prevFilters =>
                prevFilters.map(filter =>
                    filter.id === 'origin'
                        ? { ...filter, options: origin.map(origin => ({ label: origin, value: origin })) }
                        : filter
                )
            );
        } catch (error) {
            // console.error('Failed to fetch students', error);
            setStudents([]); // Ensure students is always an array
        } finally {
            setIsLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = students;
        // console.log(filtered)
        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((transaction) =>
                transaction.fullName?.toLowerCase().includes(lowercasedTerm) ||
                transaction.bookName?.toLowerCase().includes(lowercasedTerm)
            );
        }
    
        // console.log('Current Filters:', filters);
    
        // Apply department filter
        const departmentFilter = filters.find(f => f.id === 'department');
        if (departmentFilter?.value) {
            filtered = filtered.filter(transaction => transaction.studentId.programme === departmentFilter?.value?.value);
        }
    
        // console.log(filtered)
        // Apply origin filter
        const originFilter = filters.find(f => f.id === 'origin');
        console.log('Origin Filter:', originFilter);
        if (originFilter?.value) {
            // console.log('Applying Origin Filter:', originFilter.value);
            filtered = filtered.filter(transaction => transaction.origin === originFilter.value.value);
        }
    
        // Apply start year filter
        const startYearFilter = filters.filter(f => f.id === 'startYear');
        if (startYearFilter?.value) {
            filtered = filtered.filter(transaction => transaction?.studentId.startYear === startYearFilter.value.value);
        }
    
        console.log('Filtered Transactions:', filtered);
    
        setFilteredTransactions(filtered);
    };
    
    const handleFilterChange = (filterId, selectedOption) => {
        setFilters(prevFilters =>
            prevFilters.map(filter =>
                filter.id === filterId
                    ? { ...filter, value: selectedOption }
                    : filter
            )
        );
    };
    

    const handleAddStudent = (newStudent) => {
        fetchTransactions();
    };

    const handleEditStudent = (updatedStudent) => {
        fetchTransactions();
    };

    const handleDeleteStudent = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/delete-transaction/${selectedTransaction._id}`);
            setStudents(prevStudents =>
                Array.isArray(prevStudents) ? prevStudents.filter(transaction => transaction._id !== selectedTransaction._id) : []
            );
            toast.success(response.data.message);
            setDeleteModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const updateStudentStatus = async (studentId, newStatus) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-transaction-status/${studentId}`, { status: newStatus });
            toast.success(response.data.message);
            fetchTransactions(); // Refresh the transaction list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update status');
        }
    };

    const updateHODApprovalStatus = async (studentId, approved) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-hod-approved-status/${studentId}`, { HODApprovedStatus: approved });
            toast.success(response.data.message);
            fetchTransactions(); // Refresh the transaction list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update HOD approval status');
        }
    };

    const getStatusClassName = (status) => {
        switch (status) {
            case 'active':
                return 'text-blue-500';
            case 'graduated':
                return 'text-green-500';
            case 'suspended':
                return 'text-red-500';
            default:
                return 'text-red-500';
        }
    };

    const getLibraryStatusClassName = (status) => {
        switch (status) {
            case 'Approved':
                return 'text-green-500';
            case 'Not Approved':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getBookshopStatusClassName = (status) => {
        switch (status) {
            case 'Approved':
                return 'text-green-500';
            case 'Not Approved':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className='flex text-sm'>
            <ReactHotToast />

            <SideBar isOpenDrawer={isOpenDrawer} />

            <div className='overflow-hidden w-full max-h-screen border'>
                <Header onToggleDrawer={() => setIsOpenDrawer(!isOpenDrawer)} title={"Book Transactions"} profilePicture={'/images/user.png'} />
                <div className='px-5 lg:flex md:flex lg:justify-between md:justify-between items-center'>
                    <SearchField
                        placeholder={'Name or Book Name.'}
                        setSearchTerm={setSearchTerm}
                    />
                    <div className="flex flex-col lg:flex-row gap-2 items-center">
                        <FilterComponent filters={filters} onChange={handleFilterChange} />
                        {(getUserRole() === "librarian" || getUserRole() === "bookshop") && <button
                            onClick={() => setAddModalOpen(true)}
                            className='flex items-center gap-x-1 bg-violet-500 text-white rounded-md p-2 text-sm'>
                            <FaPlus /> <span>New transaction</span> 
                        </button>}
                    </div>
                </div>
                <div className='flex gap-2 px-5 justify-between items-center'>
                        {(getUserRole() === "librarian" || getUserRole() === "bookshop") && <a
                            href='/book-management'
                            onClick={() => setAddModalOpen(true)}
                            className='flex items-center gap-x-2 bg-black opacity-80 text-white rounded-md p-2 text-sm'>
                            <FaPlus /> <span>Give Out A Book</span>
                        </a>}
                        <div className='py-2 flex gap-2 justify-end'>
                            <SmallCard color={'blue'} title={'Total Books Lent'} value={filteredTransactions?.length}/>
                            <SmallCard color={'green'} title={'Books Returned'} value={booksReturned}/>
                            <SmallCard color={'orange'} title={'Books Not Returned'} value={filteredTransactions?.length  - booksReturned}/>
                        </div>
                    </div>
                <div className='overflow-scroll max-h-[70%] w-full'>
                    <table className='w-full h-8'>
                        <thead className='text-xs text-left text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Transaction ID</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Student Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Student Class</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Department</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Book Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Book Number</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Origin</th>
                                {<th scope="col" className="px-6 py-3 whitespace-nowrap"> Status</th>}
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Date Taken</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Date Returned</th>
                                {/* {(getUserRole() === "admin" || getUserRole() === "hod") && <th scope="col" className="px-6 py-3 whitespace-nowrap">HOD Status</th>} */}
                                {/* {getUserRole() === "admin" && <th scope="col" className="px-6 py-3 whitespace-nowrap">transaction Status</th>} */}
                                {(getUserRole() === "librarian" || getUserRole() === "bookshop") && <th scope="col" className="px-6 py-3 text-center whitespace-nowrap">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className='bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                                    <td colSpan='9' className='text-center py-4'>
                                        <FaSpinner className='animate-spin text-blue-500 mr-2' />
                                        Loading students...
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions?.map((transaction) => (
                                    <tr className='bg-white text-left border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={transaction._id}>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction._id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.studentId?.fullName}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.studentClass}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.studentId?.programme}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.bookName}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.bookNumber}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{transaction?.origin}</td>
                                        {<td className={`px-6 py-4 ${transaction?.status == "returned" ? 'text-green-500' : 'text-yellow-500'}`}>{transaction?.status}</td>}
                                        <td className='px-6 py-4 whitespace-nowrap'>{formatDate(transaction.dateTaken)}</td>
                                        {<td className={`px-6 py-4  whitespace-nowrap ${!transaction?.dateReturned && 'text-yellow-500  text-center'}`}>{transaction?.dateReturned ? formatDate(transaction?.dateReturned) : '-'}</td>}
                                        {/* {(getUserRole() === "librarian" || getUserRole() === "admin")  && <td className={`px-6 py-4  whitespace-nowrap ${getLibraryStatusClassName(transaction.libraryStatus)}`}>{transaction.libraryStatus}</td>}
                                        {(getUserRole() === "bookshop" || getUserRole() === "admin") && <td className={`px-6 py-4  whitespace-nowrap ${getBookshopStatusClassName(transaction.bookshopStatus)}`}>{transaction.bookshopStatus}</td>} */}
                                        {(getUserRole() === "bookshop" || getUserRole() === "librarian") && <td className='px-6 py-4 gap-x-4 flex justify-around items-center'>
                                        
                                            {(transaction.status === 'not returned') && <MdMarkChatRead
                                                className='w-10 h-10 bg-gray-100 text-blue-500 hover:text-blue-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => handleUpdateStatus(transaction._id, 'returned')}
                                                title='Mark As Returned'
                                            />
                                            }
                                            {(transaction.status === 'returned') && <MdMarkChatUnread
                                                className='w-10 h-10 bg-gray-100 text-yellow-500 hover:text-yellow-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => handleUpdateStatus(transaction._id, 'not returned')}
                                                title='Mark As Not Returned'
                                            />
                                            }

                                            {<><TrashIcon
                                                className='w-10 h-10 bg-gray-100 text-red-500 hover:text-red-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setDeleteModalOpen(true);
                                                }}
                                            />
                                            <MdOutlineEdit
                                                className='w-10 h-10 bg-gray-100 text-blue-500 hover:text-blue-300 transition-all duration-500 rounded-full p-2 '
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    setEditTransactionModal(true);
                                                }}
                                            />

                                            
                                            </>}

                                            
                                            
                                            {/* {getUserRole() === "hod" && <>
                                                {transaction.HODApprovedStatus === false ? <button
                                                    className='text-green-400 border hover:bg-green-300 hover:text-white hover:border-0 border-green-400 p-2 rounded-lg'
                                                    onClick={() => updateHODApprovalStatus(transaction._id, true)}
                                                    disabled={transaction.status == "graduated"}
                                                >
                                                    Approve
                                                </button> :
                                                <button
                                                    className={` ${transaction.status == "graduated" ? 'bg-orange-200 text-white' : 'text-orange-400  hover:bg-orange-300 hover:text-white hover:border-0 border-orange-400 border'} p-2 rounded-lg`}
                                                    onClick={() => updateHODApprovalStatus(transaction._id, false)}
                                                    disabled={transaction.status == "graduated"}
                                                >
                                                    Cancel
                                                </button>}
                                            </>} */}
                                        </td>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='text-center py-4'>
                    {filteredTransactions?.length === 0 && !isLoading && (
                        <div className='flex items-center justify-center'>
                            <FaInfoCircle className='text-yellow-400 mr-2' />
                            <p className='text-gray-500'>No students found</p>
                        </div>
                    )}
                </div>
            </div>
            <EditTransactionModal
                isOpen={isEditTransactionModalOpen}
                onClose={() => setEditTransactionModal(false)}
                transactionData={selectedTransaction}
                onTransactionUpdated={() => fetchTransactions()}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDeleteConfirm={handleDeleteStudent}
                fullName={ "transaction with " + selectedTransaction?.studentId?.fullName || ''}
            />
        </div>
    );
};

export default BookTransactions;
