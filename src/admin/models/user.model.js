const bcrypt = require('../utils/bcrypt');

module.exports = mongoose => {
    const userSchema = mongoose.Schema({
        username: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            require: true,
            //select: false
        },
        buildIn: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        // roles: {
        //     type: Array,
        //     enum: ["user", "admin"],
        //     default: ['user']
        // },
        lastLoginAt: { type: Date },
        deletedAt: { type: Date },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date }

    },
        {
            collection: 'users',
            timestamps: false
        });

    userSchema.index({ username: 'text', email: 'text' });

    userSchema.pre('save', async function (next) {
        // 1) Only run this function if password was actually modified
        if (!this.isModified('password')) return next();

        // 2) Salt & Hashing Password
        this.password = await bcrypt.hashPassword(this.password);

        next();
    });

    return mongoose.model('User', userSchema);
}