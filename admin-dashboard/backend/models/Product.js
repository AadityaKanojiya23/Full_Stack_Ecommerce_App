const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stockQuantity: { type: Number, required: true },
  image: { type: String, required: true }, // URL or path
  status: { type: String, enum: ['In Stock', 'Out Of Stock', 'Sold Out'], default: 'In Stock' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
