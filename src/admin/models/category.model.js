module.exports = mongoose => {
    const categorySchema = mongoose.Schema(
        {
            name: {
                type: String,
                required: [true, 'Vui lòng nhập tên chuyên mục.'],
                trim: true,
                unique: true
            },
            description: String,
            slug: { type: String, required: true, unique: true },
            parent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            children: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            }],
            image: String,
            controllerAction: String,
            // metadata:{

            // },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date }
        },
        {
            collection: 'categories',
            timestamps: false
        });

    categorySchema.index({ name: 'text' });

    return mongoose.model('Category', categorySchema);
}