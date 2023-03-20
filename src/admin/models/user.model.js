const bcrypt = require('../utils/bcrypt');

module.exports = mongoose => {
    const userSchema = mongoose.Schema({
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email.'],
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            require: [true, 'Vui lòng nhập mật khẩu.'],
            //select: false
        },
        // roles: {
        //     type: Array,
        //     enum: ["user", "admin"],
        //     default: ['user']
        // },
        // status: {
        //     type: Number,
        //     default: 1,
        //     //required: [ true, 'Vui lòng chọn trạng thái của tài khoản.' ]
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

    userSchema.index({ email: 'text' });

    userSchema.pre('save', async function (next) {
        // 1) Only run this function if password was actually modified
        if (!this.isModified('password')) return next();

        // 2) Salt & Hashing Password
        this.password = await bcrypt.hashPassword(this.password);

        next();
    });

    // Set passwordChangedAt field to the current time when the user change the password
    // userSchema.pre('save', function (next) {
    //     if (!this.isModified('password') || this.isNew) return next();

    //     this.passwordChangedAt = Date.now() - 1000;
    //     next();
    // });

    return mongoose.model('User', userSchema);
}