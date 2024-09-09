import User from '../models/User.js'; // Import the User model
import bcrypt from 'bcrypt'; // For password comparison

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // Exclude the password field from the user object
        const { password: _, ...userWithoutPassword } = user.toObject();

        // Respond with the user data (excluding password)
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default login;
