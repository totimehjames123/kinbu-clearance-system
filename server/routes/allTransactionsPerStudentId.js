import mongoose from 'mongoose';
import Student from '../models/Student.js'; // Import the Student model
import Transaction from '../models/Transaction.js'; // Import the Transaction model

const allTransactionsPerStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Validate the student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Check if the student ID exists in the Student model
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Retrieve all transactions for the given student ID and populate student details
        const transactions = await Transaction.find({ studentId })
            .populate('studentId', 'fullName BECEIndexNumber WASSCEIndexNumber gender programme startYear yearLevel status')
            .exec();

        // Respond with the list of transactions
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error retrieving transactions for student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default allTransactionsPerStudentId;
