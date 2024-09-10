import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Student Schema
const studentSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    BECEIndexNumber: {
        type: String,
        required: true,
        unique: true, // Ensure uniqueness
    },
    WASSCEIndexNumber: {
        type: String,
        // unique: true, // Ensure uniqueness, but not required initially
        default: null, // Use null as a placeholder for absence
    },
    gender: {
        type: String,
        required: true,
    },
    programme: {
        type: String,
        required: true,
    },
    startYear: {
        type: Number,
        required: true,
        default: () => new Date().getFullYear(), // Set default to the current year
    },
    yearLevel: {
        type: String,
        enum: ['Form 1', 'Form 2', 'Form 3'],
        default: 'Form 1',
    },
    HODApprovedStatus: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'graduated', 'suspended'],
        default: 'active',
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create and export the Student model
const Student = mongoose.model('Student', studentSchema);
export default Student;
