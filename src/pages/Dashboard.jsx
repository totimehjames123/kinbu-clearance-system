import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { FaSpinner, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MdDownload, MdOutlineEdit } from 'react-icons/md';
import ReactHotToast from '../components/ReactHotToast';
import toast from 'react-hot-toast';
import AddStudentModal from './../components/AddStudentModal';
import EditStudentModal from './../components/EditStudentModal';
import DeleteConfirmationModal from './../components/DeleteConfirmationModal';
import SearchField from '../components/SearchField';
import DashboardCard from '../components/DashboardCard';
import StudentDetailsModal from './../components/StudentDetailsModal';
import getUserRole from '../../utils/getUserRole';
import getUserDepartment from '../../utils/getUserDepartment';
import { departmentOptions } from '../../utils/constants';
import FilterComponent from '../components/FilterComponent';
import checkIsLoggedInAndNavigate from '../../utils/checkIsLoggedInAndNavigate';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [filters, setFilters] = useState([]);

    if (getUserRole() == "admin"){
        checkIsLoggedInAndNavigate(null, "/login");
    }
    else{
        checkIsLoggedInAndNavigate("/login", "/login");
    }

    useEffect(() => {
        fetchStudents();
    }, []);

    const userRole = getUserRole();

    useEffect(() => {
        fetchStudents();
    }, []);

    // Calculate dashboard card values
    const totalStudents = filteredStudents.length;
    const graduatedStudents = filteredStudents.filter(student => student.status === 'graduated').length;
    const activeStudents = filteredStudents.filter(student => student.status === 'active').length;
    const suspendedStudents = filteredStudents.filter(student => student.status === 'suspended').length;
    const clearedAtDepartment = filteredStudents.filter(student => student.HODApprovedStatus === true).length;
    const clearedAtBookshop = filteredStudents.filter(student => student.bookshopStatus === 'Approved').length;
    const clearedAtLibrary = filteredStudents.filter(student => student.libraryStatus === 'Approved').length;

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
            setFilteredStudents(allStudents)
    
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

    const calculatePercentage = (part, total) => {
        if (total === 0) return 0; // Avoid division by zero
        return ((part / total) * 100) // Return percentage with two decimal places
    };

    return (
        <div className='flex text-sm'>
            <ReactHotToast />

            <SideBar isOpenDrawer={isOpenDrawer} />

            <div className='overflow-hidden w-full max-h-screen border px-2 flex flex-col'>
                <Header onToggleDrawer={() => setIsOpenDrawer(!isOpenDrawer)} title={"Dashboard"} profilePicture={'/images/user.png'} />
                <div className='px-5 lg:flex md:flex lg:justify-between md:justify-between items-center'>
                    <SearchField
                        placeholder={'Name or BECE ID No.'}
                        setSearchTerm={setSearchTerm}
                    />
                    <div className="flex flex-col lg:flex-row gap-2 items-center">
                        <FilterComponent filters={filters} onChange={handleFilterChange} />
                    </div>
                </div>
                
                <div className='overflow-y-auto flex-grow'>
                    <div className='overflow-x-auto'>
                        <div className='flex gap-4 mb-3'>
                            <DashboardCard
                                title={'Total Students'} 
                                value={totalStudents} 
                                borderColor="border-blue-300"
                                pathColor="#93C5FD" 
                                textClass="text-blue-300" 
                                textColor="#93C5FD" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(totalStudents, totalStudents)} 
                            />
                            <DashboardCard 
                                title={'Active Students'} 
                                value={activeStudents}
                                borderColor="border-yellow-300" 
                                pathColor="#FBBF24" 
                                textClass="text-yellow-300" 
                                textColor="#FDE047" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(activeStudents, totalStudents)} 
                            />
                            <DashboardCard 
                                title={'Graduated Students'} 
                                value={graduatedStudents} 
                                borderColor="border-green-300" 
                                pathColor="#9AE6B4" 
                                textClass="text-green-300" 
                                textColor="#9AE6B4" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(graduatedStudents, totalStudents)} 
                            />
                            <DashboardCard
                                title={`Suspended Students`} 
                                value={suspendedStudents} 
                                borderColor="border-red-300" 
                                pathColor="#FEB2B2" 
                                textClass="text-red-300"
                                textColor="#FEB2B2" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(suspendedStudents, totalStudents)} 
                            />
                            <DashboardCard
                                title={`Cleared at Department`} 
                                value={clearedAtDepartment}
                                borderColor="border-gray-300" 
                                pathColor="#D1D5DB" 
                                textClass="text-gray-300" 
                                textColor="#D1D5DB" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(clearedAtDepartment, totalStudents)} 
                            />
                            <DashboardCard
                                title={`Cleared at Bookshop`} 
                                value={clearedAtBookshop} 
                                borderColor="border-indigo-300" 
                                pathColor="#A5B4FC" 
                                textClass="text-indigo-300" 
                                textColor="#A5B4FC" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(clearedAtBookshop, totalStudents)} 
                            />
                            <DashboardCard
                                title={`Cleared at Library`} 
                                value={clearedAtLibrary} 
                                borderColor="border-violet-300"
                                pathColor="#D8B4FE" 
                                textClass="text-violet-300" 
                                textColor="#D8B4FE" 
                                trailColor="#F3F4F6" 
                                backgroundColor="#f8f8f8"
                                percentage={calculatePercentage(clearedAtLibrary, totalStudents)} 
                            />

                        </div>
                    </div>
                    

                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-max h-8'>
                            <thead className='text-xs text-left text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400'>
                                <tr>                                    
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Full Name</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">BECE ID No.</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">WASSCE ID No.</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Programme</th>
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap">Begun From</th>
                                    {(getUserRole() === "admin" || getUserRole() === "hod") && <th scope="col" className="px-6 py-3 whitespace-nowrap">HOD Status</th>}
                                    {getUserRole() === "admin" && <th scope="col" className="px-6 py-3 whitespace-nowrap">Student Status</th>}
                                    {getUserRole() === "librarian" || getUserRole() === "admin" && <th scope="col" className="px-6 py-3 whitespace-nowrap">Library Status</th>}
                                    {(getUserRole() === "bookshop" || getUserRole() === "admin") && <th scope="col" className="px-6 py-3 whitespace-nowrap">Bookshop Status</th>}
                                    <th scope="col" className="px-6 py-3 text-center whitespace-nowrap">Actions</th>
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
                                        <tr title='Double click to see more' onDoubleClick={() => {
                                            setSelectedStudent(student);
                                            setDetailsModalOpen(getUserRole() === "admin" ? true : false);
                                        }} className='bg-white text-left border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' key={student._id}>
                                            <td className='px-6 py-4 whitespace-nowrap'>{student.fullName}</td>
                                            <td className='px-6 py-4 whitespace-nowrap'>{student.BECEIndexNumber}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${!student?.WASSCEIndexNumber && 'text-orange-500'}`}>{student?.WASSCEIndexNumber ? student?.WASSCEIndexNumber : "None" }</td>
                                            <td className='px-6 py-4 whitespace-nowrap'>{student.programme}</td>
                                            <td className='px-6 py-4 whitespace-nowrap'>{student.startYear}</td>
                                            {(getUserRole() === "admin" || getUserRole() === "hod") && <td className={`px-6 py-4  whitespace-nowrap ${student.HODApprovedStatus ? 'text-green-500' : 'text-red-500'}`}>{student.HODApprovedStatus ? 'Approved' : 'Not Approved'}</td>}
                                            {getUserRole() === "admin" && <td className={`px-6 py-4 ${getStatusClassName(student.status)}`}>{student.status}</td>}
                                            {getUserRole() === "librarian" || getUserRole() === "admin"  && <td className={`px-6 py-4  whitespace-nowrap ${getLibraryStatusClassName(student.libraryStatus)}`}>{student.libraryStatus}</td>}
                                            {getUserRole() === "bookshop" || getUserRole() === "admin" && <td className={`px-6 py-4  whitespace-nowrap ${getBookshopStatusClassName(student.bookshopStatus)}`}>{student.bookshopStatus}</td>}
                                            <td className='px-6 py-4 gap-x-4 flex justify-around items-center'>
                                                {getUserRole() === "admin" && <>
                                                    {student.status !== "graduated" ? <button
                                                        className={`border  ${student.WASSCEIndexNumber == null || student.libraryStatus == "Not Approved" || student.bookshopStatus == "Not Approved" || student.HODApprovedStatus == false  ? "bg-gray-300 text-white border-0 cursor-not-allowed" : "text-black hover:bg-black hover:text-white border-black hover:border-0"} p-2 rounded-lg`}
                                                        onClick={() => updateStudentStatus(student._id, 'graduated')}
                                                        disabled={(student.WASSCEIndexNumber == null || student.libraryStatus == "Not Approved" || student.bookshopStatus == "Not Approved" || student.HODApprovedStatus == false)}
                                                    >
                                                        Approve
                                                    </button> :
                                                    <button
                                                        className='text-yellow-400 border hover:bg-yellow-300 hover:text-white hover:border-0 border-yellow-400 p-2 rounded-lg'
                                                        onClick={() => updateStudentStatus(student._id, 'active')}
                                                    >
                                                        Cancel
                                                    </button>}
                                                    <MdDownload
                                                        title='Click to download clearance form!'
                                                        className='w-10 h-10 bg-gray-100 text-blue-500 hover:text-blue-300 transition-all duration-500 rounded-full p-2 '
                                                        onClick={() => {
                                                        
                                                        }}
                                                    />
                                                    </>}
                                                {getUserRole() === "hod" && <>
                                                    {student.HODApprovedStatus === false ? <button
                                                        className='text-green-400 border hover:bg-green-300 hover:text-white hover:border-0 border-green-400 p-2 rounded-lg'
                                                        onClick={() => updateHODApprovalStatus(student._id, true)}
                                                        disabled={student.status == "graduated"}
                                                    >
                                                        Approve
                                                    </button> :
                                                    <button
                                                        className={` ${student.status == "graduated" ? 'bg-orange-200 text-white' : 'text-orange-400  hover:bg-orange-300 hover:text-white hover:border-0 border-orange-400 border'} p-2 rounded-lg`}
                                                        onClick={() => updateHODApprovalStatus(student._id, false)}
                                                        disabled={student.status == "graduated"}
                                                    >
                                                        Cancel
                                                    </button>}
                                                </>}
                                            </td>
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
            </div>
            <StudentDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                studentData={selectedStudent}
                onStudentUpdated={() => fetchStudents()}
            />
        </div>
    );
};

export default Dashboard;
