import Transaction from '../models/Transaction.js'; // Import the Transaction model

const allTransactions = async (req, res) => {
    try {
        // Retrieve all transactions, populate the studentId field, and sort by createdAt in descending order
        const transactions = await Transaction.find()
            .populate('studentId', 'fullName BECEIndexNumber WASSCEIndexNumber gender programme startYear yearLevel HODApprovedStatus status')
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order

        // Respond with the list of transactions
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default allTransactions;
