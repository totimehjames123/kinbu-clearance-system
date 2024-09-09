import Transaction from '../models/Transaction.js'; // Import the Transaction model

const allTransactionsWithItsRelatedStudentId = async (req, res) => {
    try {
        // Retrieve all transactions and populate the studentId field with student details
        const transactions = await Transaction.find()
            .populate('studentId', 'fullName BECEIndexNumber WASSCEIndexNumber gender programme startYear yearLevel status') // Fields to include from Student model
            .exec();

        // Respond with the list of transactions including student details
        res.status(200).json({ transactions });
    } catch (error) {
        console.error('Error retrieving transactions with student details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default allTransactionsWithItsRelatedStudentId;
