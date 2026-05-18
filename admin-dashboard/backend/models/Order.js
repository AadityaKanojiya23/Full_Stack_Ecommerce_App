const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { 
    type: String, 
    enum: [
      'Order Confirmed', 
      'Baking in Progress', 
      'Quality Sealed & Packed', 
      'Out for Delivery', 
      'Delivered Successfully'
    ], 
    default: 'Order Confirmed' 
  },
  statusUpdates: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
