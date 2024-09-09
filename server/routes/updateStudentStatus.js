import mongoose from 'mongoose';
import Student from '../models/Student.js'; // Import the Student model

const updateStudentStatus = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status } = req.body;

        // Validate the student ID
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format' });
        }

        // Validate the status
        const validStatuses = ['active', 'graduated', 'suspended'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if status change is allowed
        if (status === 'suspended' && student.status === 'graduated') {
            return res.status(400).json({ message: 'Cannot suspend a graduated student' });
        }

        // Update the student's status
        student.status = status;
        await student.save();

        // Respond with success
        res.status(200).json({ message: 'Student status updated successfully', student });
    } catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default updateStudentStatus;
