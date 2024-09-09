import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js'; // Import the Transaction model

const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        // Validate required fields
        if (!transactionId || !status) {
            return res.status(400).json({ error: 'Transaction ID and status are required' });
        }

        // Validate transactionId format
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: 'Invalid transaction ID format' });
        }

        // Validate status value
        const validStatuses = ['returned', 'not returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Find the transaction by ID
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Update the transaction's status and dateReturned
        transaction.status = status;
        if (status === 'returned') {
            transaction.dateReturned = new Date(); // Set dateReturned to current datetime
        } else {
            transaction.dateReturned = null; // Set dateReturned to null if not returned
        }

        // Save the updated transaction
        await transaction.save();

        // Respond with success
        res.status(200).json({ message: 'Transaction status updated successfully', transaction });
    } catch (error) {
        console.error('Error updating transaction status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default updateTransactionStatus;
