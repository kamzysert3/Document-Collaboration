const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = mongoose.Schema

const userSchema = new schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to validate password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema, 'users')