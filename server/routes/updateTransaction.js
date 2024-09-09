import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js'; // Import the Transaction model

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookName, bookNumber, origin, studentClass } = req.body;

        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid transaction ID format' });
        }

        // Find the transaction by ID
        const transaction = await Transaction.findById(id);

        // Check if the transaction was found
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update fields if provided
        if (bookName) transaction.bookName = bookName;
        if (bookNumber) transaction.bookNumber = bookNumber;
        if (origin) transaction.origin = origin;
        if (studentClass) transaction.studentClass = studentClass;

        // Save the updated transaction to the database
        await transaction.save();

        // Respond with the updated transaction information
        res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        console.error('Error updating transaction:', error);
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: `Duplicate entry found for the bookNumber and origin` });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export default updateTransaction;
