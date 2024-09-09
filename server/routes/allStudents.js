import Student from '../models/Student.js';
import Transaction from '../models/Transaction.js';

const allStudents = async (req, res) => {
    try {
        // Fetch all students from the database
        const students = await Student.find().sort({ createdAt: -1 });;

        // Fetch all transactions and group them by studentId
        const transactions = await Transaction.find();
        const transactionMap = transactions.reduce((acc, txn) => {
            if (!acc[txn.studentId]) {
                acc[txn.studentId] = { libraryStatus: 'Approved', bookshopStatus: 'Approved' };
            }
            if (txn.origin === 'library' && txn.status === 'not returned') {
                acc[txn.studentId].libraryStatus = 'Not Approved';
            }
            if (txn.origin === 'bookshop' && txn.status === 'not returned') {
                acc[txn.studentId].bookshopStatus = 'Not Approved';
            }
            return acc;
        }, {});

        // Map students to include the transaction statuses
        const studentsWithStatuses = students.map(student => {
            const transactionStatus = transactionMap[student._id] || { libraryStatus: 'Approved', bookshopStatus: 'Approved' };
            return {
                ...student.toObject(),
                libraryStatus: transactionStatus.libraryStatus,
                bookshopStatus: transactionStatus.bookshopStatus,
            };
        });

        // Respond with the list of students including their transaction statuses
        res.status(200).json(studentsWithStatuses);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default allStudents;
