import mongoose from 'mongoose';
import User from '../models/User.js'; // Import the User model

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID
        if (!id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(id);

        // Check if the user was found and deleted
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default deleteUser;
