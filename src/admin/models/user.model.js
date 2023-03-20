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
        lastLogin: { type: Date },
        deleteAt: { type: Date },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date }

    },
        {
            collection: 'users',
            timestamps: false
        });

    userSchema.index({ email: 1 }, { unique: true });

    return mongoose.model('User', userSchema);
}