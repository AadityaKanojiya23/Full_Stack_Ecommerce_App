const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Customer = require('./models/Customer');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/amore_admin');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Admin.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Customer.deleteMany({});

    // Create Admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({ email: 'admin@amore.com', password: hashedPassword });
    await admin.save();
    console.log('Admin created');

    // Create Products
    const products = await Product.insertMany([
      {
        name: 'Chocolate Truffle Cake',
        price: 35.00,
        description: 'Rich chocolate layers with truffle filling and ganache glaze.',
        category: 'Cakes',
        stockQuantity: 10,
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        status: 'In Stock'
      },
      {
        name: 'Red Velvet Cupcakes (6 pcs)',
        price: 18.00,
        description: 'Classic red velvet cupcakes with cream cheese frosting.',
        category: 'Cupcakes',
        stockQuantity: 24,
        image: 'https://images.unsplash.com/photo-1614707267537-b85af00c4b81?w=500&auto=format&fit=crop&q=60',
        status: 'In Stock'
      },
      {
        name: 'Strawberry Cheesecake',
        price: 42.00,
        description: 'Creamy NY-style cheesecake topped with fresh strawberry compote.',
        category: 'Cakes',
        stockQuantity: 5,
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60',
        status: 'In Stock'
      },
      {
        name: 'French Macarons Box (12 pcs)',
        price: 28.00,
        description: 'Assorted French macarons in seasonal flavors.',
        category: 'Pastries',
        stockQuantity: 15,
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop&q=60',
        status: 'In Stock'
      },
      {
        name: 'Vanilla Birthday Cake',
        price: 45.00,
        description: 'Classic vanilla sponge with buttercream frosting and sprinkles.',
        category: 'Cakes',
        stockQuantity: 0,
        image: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?w=500&auto=format&fit=crop&q=60',
        status: 'Sold Out'
      },
      {
        name: 'Cinnamon Rolls (4 pcs)',
        price: 14.00,
        description: 'Soft oven-fresh cinnamon rolls with cream cheese glaze.',
        category: 'Pastries',
        stockQuantity: 20,
        image: 'https://images.unsplash.com/photo-1605190557626-01a85f0d8a3f?w=500&auto=format&fit=crop&q=60',
        status: 'In Stock'
      }
    ]);
    console.log('Products seeded');

    // Create Customers
    const customers = await Customer.insertMany([
      { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-0101', address: '12 Rose Lane, New York, NY 10001' },
      { name: 'Michael Chen', email: 'michael.c@email.com', phone: '+1 555-0102', address: '45 Maple Drive, Los Angeles, CA 90001' },
      { name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+1 555-0103', address: '78 Elm Street, Chicago, IL 60601' },
      { name: 'James Williams', email: 'james.w@email.com', phone: '+1 555-0104', address: '23 Oak Avenue, Houston, TX 77001' },
      { name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 555-0105', address: '56 Pine Road, Phoenix, AZ 85001' },
    ]);
    console.log('Customers seeded');

    // Create Orders
    await Order.insertMany([
      {
        customerName: customers[0].name,
        email: customers[0].email,
        address: customers[0].address,
        products: [
          { product: products[0]._id, quantity: 1 },
          { product: products[3]._id, quantity: 2 }
        ],
        totalAmount: 91.00,
        paymentStatus: 'Paid',
        orderStatus: 'Delivered Successfully',
        statusUpdates: [
          { status: 'Order Confirmed', timestamp: new Date(Date.now() - 4 * 86400000) },
          { status: 'Baking in Progress', timestamp: new Date(Date.now() - 3 * 86400000) },
          { status: 'Quality Sealed & Packed', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 86400000) },
          { status: 'Delivered Successfully', timestamp: new Date(Date.now() - 12 * 3600000) }
        ]
      },
      {
        customerName: customers[1].name,
        email: customers[1].email,
        address: customers[1].address,
        products: [
          { product: products[2]._id, quantity: 1 },
          { product: products[1]._id, quantity: 1 }
        ],
        totalAmount: 60.00,
        paymentStatus: 'Paid',
        orderStatus: 'Out for Delivery',
        statusUpdates: [
          { status: 'Order Confirmed', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Baking in Progress', timestamp: new Date(Date.now() - 86400000) },
          { status: 'Quality Sealed & Packed', timestamp: new Date(Date.now() - 6 * 3600000) },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 2 * 3600000) }
        ]
      },
      {
        customerName: customers[2].name,
        email: customers[2].email,
        address: customers[2].address,
        products: [
          { product: products[5]._id, quantity: 2 }
        ],
        totalAmount: 28.00,
        paymentStatus: 'Paid',
        orderStatus: 'Quality Sealed & Packed',
        statusUpdates: [
          { status: 'Order Confirmed', timestamp: new Date(Date.now() - 86400000) },
          { status: 'Baking in Progress', timestamp: new Date(Date.now() - 12 * 3600000) },
          { status: 'Quality Sealed & Packed', timestamp: new Date(Date.now() - 3 * 3600000) }
        ]
      },
      {
        customerName: customers[3].name,
        email: customers[3].email,
        address: customers[3].address,
        products: [
          { product: products[0]._id, quantity: 2 }
        ],
        totalAmount: 70.00,
        paymentStatus: 'Paid',
        orderStatus: 'Baking in Progress',
        statusUpdates: [
          { status: 'Order Confirmed', timestamp: new Date(Date.now() - 6 * 3600000) },
          { status: 'Baking in Progress', timestamp: new Date(Date.now() - 2 * 3600000) }
        ]
      },
      {
        customerName: customers[4].name,
        email: customers[4].email,
        address: customers[4].address,
        products: [
          { product: products[1]._id, quantity: 1 },
          { product: products[3]._id, quantity: 1 }
        ],
        totalAmount: 46.00,
        paymentStatus: 'Pending',
        orderStatus: 'Order Confirmed',
        statusUpdates: [
          { status: 'Order Confirmed', timestamp: new Date() }
        ]
      }
    ]);
    console.log('Orders seeded');
    console.log('\n✅ Demo data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
