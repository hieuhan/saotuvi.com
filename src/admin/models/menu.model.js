module.exports = mongoose => {
    const menuSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        slug: String,
        position: [
            {
                type: String,
                enum: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
                required: false
            }
        ],
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
        isDeleted: { type: Boolean, default: false },
        deletedBy: String,
        deletedAt: Date,
        createdBy: String,
        createdAt: { type: Date, default: Date.now },
        updatedBy: String,
        updatedAt: Date,
        recoverDeletedBy: String,
        recoverDeletedAt: Date
    },
        {
            collection: 'menus',
            timestamps: false
        });

    menuSchema.index({ name: 'text', slug: 'text', treeOrder: 'text' });

    return mongoose.model('Menu', menuSchema);
}