module.exports = mongoose => {
    const articleSchema = mongoose.Schema(
        {
            title: {
                type: String,
                required: [true, 'Vui lòng nhập tiêu đề bài viết.'],
                trim: true,
                unique: true
            },
            summary: String,
            content: {
                type: String,
                required: [true, 'Vui lòng nhập nội dung bài viết.']
            },
            slug: { type: String, required: true, unique: true },
            mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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
            // metadata:{

            // },
            createdAt: { type: Date, default: Date.now },
            updatedBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            updatedAt: { type: Date },
            publishedBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            publishedAt: { type: Date },
            republishedBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            republishedAt: { type: Date }
        },
        {
            collection: 'articles',
            timestamps: false
        });

        articleSchema.index({ title: 'text', summary: 'text', content: 'text' });

    return mongoose.model('Article', articleSchema);
}