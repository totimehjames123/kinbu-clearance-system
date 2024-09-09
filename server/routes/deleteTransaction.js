import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js'; // Import the Transaction model

const deleteTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params; // Use req.params for URL parameters

        // Validate required fields
        if (!transactionId) {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        // Validate transactionId format
        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: 'Invalid transaction ID format' });
        }

        // Find and delete the transaction by ID
        const result = await Transaction.findByIdAndDelete(transactionId);
        
        // Check if the transaction was found and deleted
        if (!result) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Respond with success
        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default deleteTransaction;
