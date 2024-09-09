import User from '../models/User.js'; // Import the User model
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating passwords
import sendEmail from '../utils/sendEmail.js'; // Import the reusable sendEmail function

/**
 * Generates a unique username starting with 'KNB' followed by a 10-digit number.
 *
 * @returns {string} - Generated username.
 */
const generateUsername = async () => {
    let username;
    do {
        const randomNumber = Math.floor(Math.random() * 10000000000); // 10-digit number
        username = `KNB${randomNumber.toString().padStart(10, '0')}`;
    } while (await User.findOne({ username })); // Ensure the username is unique
    return username;
};

const createUser = async (req, res) => {
    try {
        const { fullName, email, role, department } = req.body;

        // Validate required fields
        if (!fullName || !email || !role) {
            return res.status(400).json({ error: 'Full name, email, and role are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if the department already exists (only for 'hod' role)
        if (role === 'hod') {
            const existingDepartmentUser = await User.findOne({ department });
            if (existingDepartmentUser) {
                return res.status(400).json({ error: 'Department already has a user assigned' });
            }
        }

        // Generate a unique username  
        const username = await generateUsername();

        // Generate a new password
        const generatedPassword = uuidv4().slice(0, 12); // Generate a random password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        // Create a new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            role,
            department: role === 'hod' ? department : undefined, // Only set department if role is 'hod'
        });

        // Save the user to the database
        await newUser.save();

        // Prepare the email content
        const subject = 'Welcome to Kinbu Clearance System';
        const text = `Dear ${fullName},\n\n` +
                      `You have been successfully added to the system.\n` +
                      `Role: ${role}\n` +
                      `${role === 'hod' ? `Department: ${department}\n` : ''}` +
                      `Username: ${username}\n` +
                      `Password: ${generatedPassword}\n\n` +
                      `Please change your password after your first login.\n\n` +
                      `Best regards,\nKinbu SHS (Administrator)`;

        // Send confirmation email using the reusable function
        try {
            await sendEmail(email, subject, text);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({ error: 'User created, but failed to send confirmation email' });
        }

        // Respond with success
        res.status(201).json({ message: 'User created successfully, and email sent' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default createUser;
