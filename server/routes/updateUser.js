import mongoose from 'mongoose';
import User from '../models/User.js'; // Import the User model

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, role, department } = req.body;

        // Check if department is provided for HOD role
        if (role === "hod" && (!department || department.trim() === "")) {
            return res.status(400).json({ error: 'Department field is required for HODs.' });
        }

        // Validate the ID 
        if (!id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format.' });
        }

        // Find the user by ID
        const user = await User.findById(id);

        // Check if the user was found
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Check if the new department is already taken by another HOD
        if (role === 'hod') {
            // Check if the department is already assigned to another HOD
            const existingHOD = await User.findOne({ department, role: 'hod' });
            if (existingHOD && existingHOD._id.toString() !== id) {
                return res.status(400).json({ error: 'Department already has a user assigned.' });
            }
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (role) {
            user.role = role;
            if (role === 'hod') {
                user.department = department;
            } else {
                user.department = undefined; // Clear department if role is not 'hod'
            }
        } else if (department && role !== 'hod') {
            user.department = undefined; // Clear department if role is not 'hod'
        }

        // Save the updated user to the database
        await user.save();

        // Prepare success response
        const { password, ...userWithoutPassword } = user.toObject();
        const successMessage = 'User updated successfully';

        // Respond with success message and updated user information (excluding password)
        res.status(200).json({
            message: successMessage,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};
 
export default updateUser;
