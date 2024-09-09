// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the User Schema
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'bookshop', 'librarian', 'hod'],
        required: true,
    },
    department: {
        type: String,
        // Optional field, only relevant if role is 'hod'
        required: function() { return this.role === 'hod'; }, 
        trim: true,
    },
    verificationCode: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;
