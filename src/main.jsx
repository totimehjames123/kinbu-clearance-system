"use client"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BookManagement from './pages/BookManagement.jsx'
import ManageStudents from './pages/ManageStudents.jsx'
import ManageUsers from './pages/ManageUsers.jsx'
import BookTransactions from './pages/BookTransactions.jsx'
import UpdatePassword from './pages/UpdatePassword.jsx'


const router = createBrowserRouter([
  {
    path: '*',
    element: <PageNotFound />
  },
  {
    path: '/',
    element: <App /> 
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/update-password',
    element: <UpdatePassword />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/book-management',
    element: <BookManagement />
  },
  {
    path: '/book-transactions',
    element: <BookTransactions />
  },
  {
    path: '/manage-users',
    element: <ManageUsers />
  },
  {
    path: '/manage-students',
    element: <ManageStudents />
  },
  

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}/>
  </React.StrictMode>, 
)
