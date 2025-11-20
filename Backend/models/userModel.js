import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: [true, "Please specify a role"]
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

export default User;
