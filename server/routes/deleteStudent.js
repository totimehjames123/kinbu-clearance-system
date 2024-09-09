import mongoose from 'mongoose';
import Student from '../models/Student.js'; // Import the Student model

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Find and delete the student by ID
        const student = await Student.findByIdAndDelete(id);

        // Check if the student was found and deleted
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default deleteStudent;
