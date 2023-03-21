module.exports = mongoose => {
    const articleSchema = mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },
            summary: String,
            content: {
                type: String,
                required: true
            },
            slug: { type: String, required: true, unique: true },
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
            categories: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category'
                }
            ],
            tags: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Tag'
                }
            ],
            indexes: [
                {
                    title: String,
                    bookmark: String
                }
            ],
            image: String,
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
            publishedBy: String,
            publishedAt: Date,
            republishedBy: String,
            republishedAt: Date
        },
        {
            collection: 'articles',
            timestamps: false
        });

        articleSchema.index({ title: 'text', summary: 'text', content: 'text', slug: 'text' });

    return mongoose.model('Article', articleSchema);
}