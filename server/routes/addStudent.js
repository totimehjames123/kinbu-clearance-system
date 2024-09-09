import Student from '../models/Student.js'; // Import the Student model

const addStudent = async (req, res) => {
    try {
        const { fullName, BECEIndexNumber, gender, programme, yearLevel } = req.body;

        // Validate required fields
        if (!fullName || !BECEIndexNumber || !gender || !programme) {
            return res.status(400).json({ error: 'Full name, BECE index number, gender, and programme are required' });
        }

        // Check for existing BECEIndexNumber
        const existingBECE = await Student.findOne({ BECEIndexNumber });
        if (existingBECE) {
            return res.status(400).json({ error: 'BECE index number already exists' });
        }

        // Create a new student
        const newStudent = new Student({
            fullName,
            BECEIndexNumber,
            gender,
            programme,
            yearLevel: yearLevel || 'Form 1', // Default to 'Form 1' if not provided
        });

        // Save the student to the database
        await newStudent.save();

        // Respond with success
        res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.error('Error adding student:', error);
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Duplicate entry found' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

export default addStudent;
