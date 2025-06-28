const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  orders: [
    {
      orderDetails: {
        paymentMethod: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      },
      items: [
        {
          name: String,
          quantity: Number,
          price: Number
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Order', orderSchema);
