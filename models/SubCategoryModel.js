const mongoose = require('mongoose');
const { Category } = require('./CategoryModel');
const { ErrorHandler } = require('../utils/errorHandler');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });


subCategorySchema.pre('save', async function (next){
    const category = await Category.find(this.category)
    if (!category) {
        return next(new ErrorHandler('category not found', 404))
    }
    next()
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = {SubCategory};