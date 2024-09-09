import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Student from '../models/Student.js'; // Import the Student model

const addTransaction = async (req, res) => {
    try {
        const { studentId, studentClass, bookName, bookNumber, origin } = req.body;

        // Validate required fields
        if (!studentId || !studentClass || !bookName || !bookNumber || !origin) {
            return res.status(400).json({ error: 'Student ID, student class, book name, book number, and origin are required' });
        }

        // Validate studentId format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Check if the student exists
        const studentExists = await Student.findById(studentId);
        if (!studentExists) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Create a new transaction
        const newTransaction = new Transaction({
            studentId,
            studentClass,
            bookName,
            bookNumber,
            origin,
        });

        // Save the transaction to the database
        await newTransaction.save();

        // Respond with success
        res.status(201).json({ message: 'Book transaction recorded successfully', transaction: newTransaction });
    } catch (error) {
        console.error('Error adding transaction:', error);

        if (error.code === 11000) { // Duplicate key error
            // Extract the conflicting origin from the error message
            const conflictingOrigin = error.message.match(/index: .*_(.*)/)?.[1];
            const errorMessage = conflictingOrigin 
                ? `This book number has already been recorded for the ${conflictingOrigin} origin`
                : 'This book number has already been recorded for this origin';
            
            res.status(400).json({ error: errorMessage });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export default addTransaction;
