import mongoose from 'mongoose';
import Student from '../models/Student.js'; // Import the Student model

const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, BECEIndexNumber, WASSCEIndexNumber, gender, programme, yearLevel } = req.body;

        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid student ID format' });
        }

        // Find the student by ID
        const student = await Student.findById(id);

        // Check if the student was found
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Check for existing BECEIndexNumber
        if (BECEIndexNumber && BECEIndexNumber !== student.BECEIndexNumber) {
            const existingBECE = await Student.findOne({ BECEIndexNumber });
            if (existingBECE) {
                return res.status(400).json({ error: 'BECE index number already exists' });
            }
        }

        // Update fields if provided
        if (fullName) student.fullName = fullName;
        if (BECEIndexNumber) student.BECEIndexNumber = BECEIndexNumber;

        // Handle WASSCEIndexNumber
        if (WASSCEIndexNumber !== undefined) {
            const trimmedWASSCEIndexNumber = WASSCEIndexNumber.trim();
            if (trimmedWASSCEIndexNumber === '') {
                // Set WASSCEIndexNumber to null if the trimmed value is empty
                student.WASSCEIndexNumber = null;
            } else {
                // Check for existing WASSCEIndexNumber only if it's provided and changed
                if (trimmedWASSCEIndexNumber !== student.WASSCEIndexNumber) {
                    const existingWASSCE = await Student.findOne({ WASSCEIndexNumber: trimmedWASSCEIndexNumber });
                    if (existingWASSCE) {
                        return res.status(400).json({ error: 'WASSCE index number already exists' });
                    }
                }
                student.WASSCEIndexNumber = trimmedWASSCEIndexNumber;
            }
        }

        if (gender) student.gender = gender;
        if (programme) student.programme = programme;
        if (yearLevel) student.yearLevel = yearLevel;

        // Save the updated student to the database
        await student.save();

        // Respond with the updated student information
        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (error) {
        console.error('Error updating student:', error);
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Duplicate entry found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export default updateStudent;
