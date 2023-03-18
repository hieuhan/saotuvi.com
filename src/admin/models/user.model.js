const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, 'Vui lòng nhập email.' ],
        lowercase: true,
        unique: true
    },
    password: { 
        type: String, 
        require: [ true, 'Vui lòng nhập mật khẩu.' ],
        //select: false
    },
    roles: { 
        type: Array, 
        default: ['user'] 
    },
    status: {
        type: Number,
        default: 1,
        //required: [ true, 'Vui lòng chọn trạng thái của tài khoản.' ]
    },
    lastLogin: { type: Date },
    deleteAt: { type: Date },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date }
    
}, 
{ 
    collection: 'users',
    timestamps: false  
});

userSchema.index({ email: 1 }, { unique: true })
module.exports = mongoose.model('User', userSchema);