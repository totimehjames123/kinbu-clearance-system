import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBuildingUser, FaCircleQuestion, FaHandHoldingHeart, FaRightFromBracket } from 'react-icons/fa6';
import Logo from './Logo';
import { BsBook, BsGrid, BsPersonAdd, BsPersonCircle, BsPersonPlus, BsPlusCircleDotted, BsQuestionCircle } from 'react-icons/bs';
import { MdGroup, MdGroupAdd } from 'react-icons/md';
import { FaGraduationCap } from 'react-icons/fa';
import { getUserRole } from '../../utils/getUserRole'; // Import getUserRole function

function SideBar({ isOpenDrawer }) {
    const userRole = getUserRole(); // Use getUserRole to get the user's role
    const navigate = useNavigate();

    const notifyLogout = () => {
        if (confirm("Are you sure you want to logout? Click OK to confirm.")) {
            navigate('/login');
            localStorage.removeItem('currentUser');
        } else {
            alert('Login attempt cancelled!');
        }
    };

    const navLinks = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <BsGrid size={20} />,
            role: "admin",
        },
        {
            title: "Book Shop",
            path: "/book-management",
            icon: <BsGrid size={20} />,
            role: "bookshop",
        },
        {
            title: "Library",
            path: "/book-management",
            icon: <BsGrid size={20} />,
            role: "librarian",
        },
        {
            title: "Book Transactions",
            path: "/book-transactions",
            icon: <BsBook size={20} />,
            role: "librarian",
        },
        {
            title: "Book Transactions",
            path: "/book-transactions",
            icon: <BsBook size={20} />,
            role: "admin",
        },
        {
            title: "Book Transactions",
            path: "/book-transactions",
            icon: <BsBook size={20} />,
            role: "bookshop",
        },
        {
            title: "Manage Students",
            path: "/manage-students",
            icon: <FaGraduationCap size={20} />,
            role: "admin",
        },
        {
            title: "Manage Users",
            path: "/manage-users",
            icon: <BsPersonPlus size={20} />,
            role: "admin",
        },
        {
            title: "Head Of Department",
            path: "/manage-students",
            icon: <BsGrid size={20} />,
            role: "hod",
        },
        {
            title: "Seek Help",
            path: "mailto:totimehjames123@gmail.com",
            icon: <BsQuestionCircle size={20} />,
            role: "s",
        }
    ];

    const filteredNavLinks = navLinks.filter(navLink => {
        // Show links where the role matches the user's role
        return navLink.role === userRole;
    });

    return (
        <aside className={`relative bg-black h-screen text-gray-200 transform transition-width pt-2 duration-500 ${isOpenDrawer ? 'lg:w-[20%] md:w-[40%] w-[100%]' : 'lg:w-12 w-0 lg:block'}`}>
            <div className={`flex justify-between m-2 mb-9`}>
                {!isOpenDrawer ? <img
                    className="mx-auto h-8 w-auto rounded-full"
                    src="/images/logo.png"
                    alt="Your Company"
                /> :
                <Logo />
                }
            </div>
            <div className={'h-[80%]'}>
                {filteredNavLinks.map((navLink, index) => (
                    <NavLink to={navLink.path} key={index} className={`relative hover:bg-gray-800 hover:transition-all hover:duration-700 flex items-center`}>
                        <span id='span' className={`absolute inset-y-0 left-0 w-1 ${!isOpenDrawer && "lg:block hidden "}  rounded-tr rounded-br`} aria-hidden="true"></span>
                        <span className={`flex m-3`}>
                            <span className={`${!isOpenDrawer && 'lg:flex hidden'}`}>{navLink.icon}</span>
                            <span className='ml-2 text-sm'>
                                {isOpenDrawer && navLink.title}
                            </span>
                        </span>
                    </NavLink>
                ))}
            </div>
            <div className='relative'>
                <button className={`flex ml-3 text-sm absolute ${ isOpenDrawer && 'bottom-7'}`} onClick={notifyLogout}>
                    <FaRightFromBracket size={20} className={`${!isOpenDrawer && 'lg:flex hidden'} mr-3`} />
                    <span className={`${!isOpenDrawer && 'hidden'}`}>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default SideBar;
