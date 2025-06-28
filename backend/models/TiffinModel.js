const mongoose = require('mongoose');

const tiffinItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
});

const tiffinSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true },
    tiffins: [tiffinItemSchema]
});

module.exports = mongoose.model('Tiffin', tiffinSchema);