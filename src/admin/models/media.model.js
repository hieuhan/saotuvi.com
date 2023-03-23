module.exports = mongoose => {
    const mediaSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        path: {
            type: String,
            trim: true,
            lowercase: true
        },
        content: String,
        size: Number,
        contentType: String,
        isDeleted: { type: Boolean, default: false },
        deletedBy: String,
        deletedAt: Date,
        createdBy: String,
        createdAt: { type: Date, default: Date.now },
        updatedBy: String,
        updatedAt: Date
    },
        {
            collection: 'medias',
            timestamps: false
        });

        mediaSchema.index({ name: 'text', path: 'text' });

    return mongoose.model('Media', mediaSchema);
}