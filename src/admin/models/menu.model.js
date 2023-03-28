module.exports = mongoose => {
    const menuSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        nameLower: { type: String, trim: true, lowercase: true, required: true },
        description: String,
        slug: String,
        position:
        {
            type: String,
            enum: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
            required: false
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            require: false
        },
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu',
            require: false
        },
        parentSlug: String,
        level: String,
        treeOrder: String,
        displayOrder: Number,
        image: String,
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
            collection: 'menus',
            timestamps: false
        });

    menuSchema.index({ name: 'text', nameLower: 'text', slug: 'text', treeOrder: 'text' });

    menuSchema.pre('save', async function (next) {
        if (!this.isModified('name') || !this.isNew) return next();

        this.nameLower = this.name.toLowerCase();

        next();
    });

    return mongoose.model('Menu', menuSchema);
}