import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    correctAnswer: {
        type: String,
        required: true,
    },
    marks: {
        type: Number,
        required: true,
        default: 1,
    }
});


const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This creates a relationship with the User model
        },
        questions: [questionSchema],
        duration: {
            type: Number, // Duration in minutes
            required: true,
        },
        scheduledAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt timestamps
    }
);

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
