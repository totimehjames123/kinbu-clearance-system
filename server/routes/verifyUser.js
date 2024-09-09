// routes/verifyUser.js
import User from '../models/User.js'; // Import the User model

// Verify User Endpoint
const verifyUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch user by id
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data if found
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default verifyUser;
