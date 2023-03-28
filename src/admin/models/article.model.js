module.exports = mongoose => {
    const articleSchema = mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },
            titleLower: { type: String, trim: true, lowercase: true },
            summary: String,
            content: {
                type: String,
                required: true
            },
            slug: { type: String, trim: true, lowercase: true, required: true, unique: true },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            },
            subCategory: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Category'
                }
            ],
            tag: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Tag'
                }
            ],
            catalog: [
                {
                    title: String,
                    bookmark: String
                }
            ],
            image: String,
            displayOrder: Number,
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
            //publishedBy: String,
            //publishedAt: Date,
            //republishedBy: String,
            //republishedAt: Date
        },
        {
            collection: 'articles',
            timestamps: false
        });

    articleSchema.index({ title: 'text', titleLower : 'text', summary: 'text', content: 'text', slug: 'text' });

    articleSchema.pre('save', async function (next) {
        if (!this.isModified('title') || !this.isNew) return next();

        this.titleLower = this.title.toLowerCase();

        next();
    });

    return mongoose.model('Article', articleSchema);
}