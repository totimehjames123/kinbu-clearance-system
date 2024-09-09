import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { FaSpinner, FaPlus, FaInfoCircle } from 'react-icons/fa';
import ReactHotToast from '../components/ReactHotToast';
import toast from 'react-hot-toast';
import AddStudentModal from './../components/AddStudentModal';
import EditStudentModal from './../components/EditStudentModal';
import DeleteConfirmationModal from './../components/DeleteConfirmationModal';
import SearchField from '../components/SearchField';
import getUserRole from '../../utils/getUserRole';
import getUserDepartment from '../../utils/getUserDepartment';
import { departmentOptions } from '../../utils/constants';
import FilterComponent from '../components/FilterComponent';
import BookManagementModal from '../components/BookManagementModal';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

const BookManagement = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [filters, setFilters] = useState([]);


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

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (userRole !== 'hod') {
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
                    id: 'startYear',
                    label: 'Start Year',
                    options: [],
                    value: null,
                    isMulti: false,
                }
            ]);
        } else {
            setFilters([
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

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/all-students`);
            let allStudents = Array.isArray(response.data) ? response.data : [];
            
            const role = getUserRole();
            if (role === 'hod') {
                const department = getUserDepartment();
                allStudents = allStudents.filter(student => student.programme === department);
            }

            // Update state with the filtered or unfiltered list of students
            setStudents(allStudents);

            // Extract start years
            const startYears = Array.from(new Set(allStudents.map(student => student.startYear)))
                .filter(year => year); // Remove any undefined or null values

            // Update filters state with extracted start years
            setFilters(prevFilters =>
                prevFilters.map(filter =>
                    filter.id === 'startYear'
                        ? { ...filter, options: startYears.map(year => ({ label: year, value: year })) }
                        : filter
                )
            );
        } catch (error) {
            console.error('Failed to fetch students', error);
            setStudents([]); // Ensure students is always an array
        } finally {
            setIsLoading(false);
        }
    };

    const filterStudents = () => {
        let filtered = students;

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((student) =>
                student.fullName.toLowerCase().includes(lowercasedTerm) ||
                student.BECEIndexNumber.toLowerCase().includes(lowercasedTerm)
            );
        }

        // Apply department filter
        const departmentFilter = filters.find(f => f.id === 'department');
        if (departmentFilter?.value) {
            filtered = filtered.filter(student => student.programme === departmentFilter?.value?.value);
        }

        // Apply start year filter
        const startYearFilter = filters.find(f => f.id === 'startYear');
        if (startYearFilter?.value) {
            filtered = filtered.filter(student => student.startYear === startYearFilter.value.value);
        }

        setFilteredStudents(filtered);
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
        fetchStudents();
    };

    const handleEditStudent = (updatedStudent) => {
        fetchStudents();
    };

    const handleDeleteStudent = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/delete-student/${selectedStudent._id}`);
            setStudents(prevStudents =>
                Array.isArray(prevStudents) ? prevStudents.filter(student => student._id !== selectedStudent._id) : []
            );
            toast.success(response.data.message);
            setDeleteModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete');
        }
    };

    const updateStudentStatus = async (studentId, newStatus) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-student-status/${studentId}`, { status: newStatus });
            toast.success(response.data.message);
            fetchStudents(); // Refresh the student list
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update status');
        }
    };

    const updateHODApprovalStatus = async (studentId, approved) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/update-hod-approved-status/${studentId}`, { HODApprovedStatus: approved });
            toast.success(response.data.message);
            fetchStudents(); // Refresh the student list
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
                <div className='bg-yellow-300 p-3 m-0 text-center text-gray-800'>
                    Click the 'Give out' button of whichever student you want to give out a book!
                </div>
                {(getUserRole() == "librarian" || getUserRole() == "bookshop") && <Header onToggleDrawer={() => setIsOpenDrawer(!isOpenDrawer)} title={getUserRole() == "librarian" ? "Library" : "Book Shop"} profilePicture={'/images/user.png'} />}
                {getUserRole() == "admin" && <Header onToggleDrawer={() => setIsOpenDrawer(!isOpenDrawer)} title={"Book Management"} profilePicture={'/images/user.png'} />}
                <div className='p-5 lg:flex md:flex lg:justify-between md:justify-between items-center'>
                    <SearchField
                        placeholder={'Name or BECE ID No.'}
                        setSearchTerm={setSearchTerm}
                    />
                    <div className="flex flex-col lg:flex-row gap-2 items-center">
                        <FilterComponent filters={filters} onChange={handleFilterChange} />
                    </div>
                </div>
                <div className='overflow-scroll max-h-[70%] w-full'>
                    <table className='w-full h-8'>
                        <thead className='text-xs text-left text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Reg ID.</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Full Name</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">BECE ID No.</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">WASSCE ID No.</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Gender</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Programme</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Begun From</th>
                                {getUserRole() === "hod" && <th scope="col" className="px-6 py-3 whitespace-nowrap">HOD Status</th>}
                                {getUserRole() === "admin" && <th scope="col" className="px-6 py-3 whitespace-nowrap">Student Status</th>}
                                {getUserRole() === "librarian"  && <th scope="col" className="px-6 py-3 whitespace-nowrap">Library Status</th>}
                                {(getUserRole() === "bookshop" ) && <th scope="col" className="px-6 py-3 whitespace-nowrap">Bookshop Status</th>}
                                {(getUserRole() === "bookshop" || getUserRole() === "librarian" )&& <th scope="col" className="px-6 py-3 text-center whitespace-nowrap">Actions</th>}
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
                                filteredStudents?.map((student) => (
                                    <tr  className='bg-white text-left border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={student._id}>                                        <td className='px-6 py-4 whitespace-nowrap'>{student._id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{student.fullName}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{student.BECEIndexNumber}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap ${!student?.WASSCEIndexNumber && 'text-orange-500'}`}>{student?.WASSCEIndexNumber ? student?.WASSCEIndexNumber : "None" }</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{student.gender}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{student.programme}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>{student.startYear}</td>
                                        {(getUserRole() === "hod") && <td className={`px-6 py-4  whitespace-nowrap ${student.HODApprovedStatus ? 'text-green-500' : 'text-red-500'}`}>{student.HODApprovedStatus ? 'Approved' : 'Not Approved'}</td>}
                                        {getUserRole() === "admin" && <td className={`px-6 py-4 ${getStatusClassName(student.status)}`}>{student.status}</td>}
                                        {getUserRole() === "librarian"  && <td className={`px-6 py-4  whitespace-nowrap ${getLibraryStatusClassName(student.libraryStatus)}`}>{student.libraryStatus}</td>}
                                        {getUserRole() === "bookshop" && <td className={`px-6 py-4  whitespace-nowrap ${getBookshopStatusClassName(student.bookshopStatus)}`}>{student.bookshopStatus}</td>}
                                        {(getUserRole() === "bookshop" || getUserRole() === "librarian") && <td className='px-6 py-4 gap-x-4 flex justify-around items-center'>
                                            <button
                                                className={`${student.status == "graduated" || student.status == "suspended" ? "bg-gray-300 text-white border-0 cursor-not-allowed" : "text-black hover:bg-black hover:text-white border-black hover:border-0  rounded-lg"} p-2 rounded-md`}
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setDetailsModalOpen(true);
                                                }}                                               
                                                disabled={student.status == "graduated" || student.status == "suspended"}
                                                title='Cannot give out books to graduated and suspended students.'
                                            >
                                                Give Out
                                            </button>                                         
                                        </td>}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='text-center py-4'>
                    {filteredStudents?.length === 0 && !isLoading && (
                        <div className='flex items-center justify-center'>
                            <FaInfoCircle className='text-yellow-400 mr-2' />
                            <p className='text-gray-500'>No students found</p>
                        </div>
                    )}
                </div>
            </div>
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onStudentAdded={handleAddStudent}
            />
            <EditStudentModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                studentData={selectedStudent}
                onStudentUpdated={handleEditStudent}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDeleteConfirm={handleDeleteStudent}
                fullName={selectedStudent?.fullName || ''}
            />
            <BookManagementModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                studentData={selectedStudent}
                onStudentUpdated={() => fetchStudents()}
            />
        </div>
    );
};

export default BookManagement;
