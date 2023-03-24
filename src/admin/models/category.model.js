module.exports = mongoose => {
    const categorySchema = mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },
            description: String,
            slug: { type: String, required: true, unique: true },
            parent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
                require: false
            },
            parentSlug: String,
            level: String,
            treeOrder: String,
            displayOrder: { type: Number, default: 0 },
            image: String,
            controllerAction: String,
            metaTitle: String,
            metaDescription: String,
            metaKeywords: String,
            h1Tag: String,
            canonical: String,
            isIndex: { type: Boolean, default: true },
            isDeleted: { type: Boolean, default: false },
            createdBy: String,
            createdAt: { type: Date, default: Date.now },
            updatedBy: String,
            updatedAt: Date,
            deletedBy: String,
            deletedAt: Date,
            recoverDeletedBy: String,
            recoverDeletedAt: Date
        },
        {
            collection: 'categories',
            timestamps: false
        });

    categorySchema.index({ name: 'text', slug: 'text', treeOrder: 'text' });

    return mongoose.model('Category', categorySchema);
}