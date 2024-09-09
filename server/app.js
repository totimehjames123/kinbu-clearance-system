import express from 'express'
import bodyParser  from 'body-parser';
import connectDB  from './config.js'
import cors from 'cors'

//import routes
import createUser from './routes/createUser.js';
import login from './routes/login.js';
import changePassword from './routes/changePassword.js';
import forgotPassword from './routes/forgotPassword.js';
import resetPassword from './routes/resetPassword.js';
import allUsers from './routes/allUsers.js';
import updateUser from './routes/updateUser.js';
import deleteUser from './routes/deleteUser.js';
import addStudent from './routes/addStudent.js';
import updateStudent from './routes/updateStudent.js';
import updateStudentStatus from './routes/updateStudentStatus.js';
import deleteStudent from './routes/deleteStudent.js';
import allStudents from './routes/allStudents.js';
import addTransaction from './routes/addTransaction.js';
import allTransactions from './routes/allTransactions.js';
import allTransactionsPerStudentId from './routes/allTransactionsPerStudentId.js';
import allTransactionsWithItsRelatedStudentId from './routes/allTransactionsWithItsRelatedStudentId.js';
import updateTransaction from './routes/updateTransaction.js';
import updateTransactionStatus from './routes/updateTransactionStatus.js';
import deleteTransaction from './routes/deleteTransaction.js';
import updateHODApprovedStatus from './routes/updateHODApprovedStatus.js';
import verifyUser from './routes/verifyUser.js';

//Create an express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//use routes import
// (User)
app.post('/create-user', createUser)
app.post('/login', login)
app.post('/verify-user', verifyUser)
app.post('/change-password', changePassword)
app.post('/forgot-password', forgotPassword)
app.post('/reset-password', resetPassword)
app.get('/all-users', allUsers)
app.put('/update-user/:id', updateUser)
app.delete('/delete-user/:id', deleteUser)

//(students)
app.post('/add-student', addStudent)
app.get('/all-students', allStudents)
app.put('/update-student/:id', updateStudent)
app.put('/update-student-status/:studentId', updateStudentStatus)
app.delete('/delete-student/:id', deleteStudent)

//(Book transactions)
app.post('/add-transaction', addTransaction)
app.get('/all-transactions', allTransactions)
app.get('/all-transactions-per-student-id/:studentId', allTransactionsPerStudentId)
app.get('/all-transactions-with-its-related-student-id', allTransactionsWithItsRelatedStudentId)
app.put('/update-transaction/:id', updateTransaction)
app.put('/update-transaction-status', updateTransactionStatus)
app.delete('/delete-transaction/:transactionId', deleteTransaction)

//(HOD)
app.put('/update-hod-approved-status/:studentId', updateHODApprovedStatus)


// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});