import mongoose from 'mongoose';
import Student from '../models/Student.js'; // Import the Student model

const updateHODApprovedStatus = async (req, res) => {
    try {
        const { studentId } = req.params; // Extract studentId from URL parameters
        const { HODApprovedStatus } = req.body; // Extract HODApprovedStatus from request body

        // Validate required fields
        if (typeof HODApprovedStatus !== 'boolean') {
            return res.status(400).json({ error: 'HODApprovedStatus must be a boolean' });
        }

        // Check if the student ID is valid
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Update the HODApprovedStatus field
        student.HODApprovedStatus = HODApprovedStatus;

        // Save the updated student
        await student.save();

        // Respond with success
        res.status(200).json({ message: 'HOD approval status updated successfully', student });
    } catch (error) {
        console.error('Error updating HOD approval status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default updateHODApprovedStatus;
