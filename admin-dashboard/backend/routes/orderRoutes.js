const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.orderStatus = orderStatus;
    order.statusUpdates.push({ status: orderStatus });
    await order.save();
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus !== 'Delivered Successfully').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered Successfully').length;
    const revenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenue
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
