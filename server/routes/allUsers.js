import User from '../models/User.js'; // Import the User model

const allUsers = async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find({}, '-password').sort({ createdAt: -1 }); // Exclude the password field from the result

        // Respond with the list of users
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default allUsers;
