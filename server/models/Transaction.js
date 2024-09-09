import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define the Transaction Schema
const transactionSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student', // Reference to the Student model
        required: true,
    },
    studentClass: {
        type: String,
        required: true,
    },
    bookName: {
        type: String,
        required: true,
    },
    bookNumber: {
        type: String,
        required: true,
    },
    origin: {
        type: String,
        enum: ['library', 'bookshop'],
        required: true,
    },
    dateTaken: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['returned', 'not returned'],
        default: 'not returned',
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create a compound index to ensure that bookNumber is unique within each origin
transactionSchema.index({ bookNumber: 1, origin: 1 }, { unique: true });

// Create and export the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
