module.exports = mongoose => {
    const categorySchema = mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },
            nameLower: { type: String, trim: true, lowercase: true },
            description: String,
            slug: { type: String, trim: true, lowercase: true, required: true, unique: true },
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
            isDraft: { type: Boolean, default: true },
            createdBy: String,
            createdAt: { type: Date, default: Date.now },
            updatedBy: String,
            updatedAt: Date,
            draftedBy: String,
            draftedAt: Date,
            recoverDraftedBy: String,
            recoverDraftedAt: Date
        },
        {
            collection: 'categories',
            timestamps: false
        });

    categorySchema.index({ name: 'text', nameLower : 'text', slug: 'text', treeOrder: 'text' });

    categorySchema.pre('save', async function (next) {
        if (!this.isModified('name')  || !this.isNew) return next();

        this.nameLower = this.name.toLowerCase();

        next();
    });

    return mongoose.model('Category', categorySchema);
}