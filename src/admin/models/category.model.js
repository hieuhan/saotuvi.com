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
            image: String,
            controllerAction: String,
            metaData:{
                metaTitle: String,
                metaDescription: String,
                metaKeywords: String,
                h1Tag: String,
                canonical: String,
                isIndex: { type: Boolean, default: true }
            },
            displayOrder: Number,
            createdBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            createdAt: { type: Date, default: Date.now },
            updatedBy: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            updatedAt: { type: Date }
        },
        {
            collection: 'categories',
            timestamps: false
        });

    categorySchema.index({ name: 'text', slug: 'text', treeOrder: 'text' });

    return mongoose.model('Category', categorySchema);
}