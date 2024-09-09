import User from '../models/User.js'; // Import the User model
import bcrypt from 'bcrypt'; // For password hashing

const changePassword = async (req, res) => {
    try {
        const { username, currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Username, current password, and new password are required' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare the provided current password with the hashed password in the database
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Validate new password (optional, e.g., minimum length)
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        // Respond with success
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default changePassword;
