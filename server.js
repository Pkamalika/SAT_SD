const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  { id: 1, name: "Smartphone", category: "Electronics", price: 15000, stock: 20, emoji: "📱", description: "Fast, stylish smartphone for everyday use." },
  { id: 2, name: "Wireless Headphones", category: "Electronics", price: 2499, stock: 35, emoji: "🎧", description: "Comfortable headphones with rich sound." },
  { id: 3, name: "Running Shoes", category: "Fashion", price: 1999, stock: 18, emoji: "👟", description: "Lightweight shoes for daily training." },
  { id: 4, name: "Smart Watch", category: "Electronics", price: 3299, stock: 12, emoji: "⌚", description: "Track your activity and stay connected." },
  { id: 5, name: "Backpack", category: "Fashion", price: 899, stock: 25, emoji: "🎒", description: "Everyday backpack with spacious storage." },
  { id: 6, name: "Coffee Mug", category: "Home", price: 299, stock: 50, emoji: "☕", description: "A ceramic mug for your favourite drink." }
];

let cart = [];
let orders = [];
let payments = [];
let nextOrderId = 1001;
let nextPaymentId = 5001;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Online Shopping API is running" });
});

// TASK 1: Search products
// GET /api/products?search=phone
app.get("/api/products", (req, res) => {
  const term = String(req.query.search || "").toLowerCase();
  const result = products.filter(p =>
    p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
  );
  res.status(200).json(result);
});

// TASK 1: Get product details
// GET /api/products/1
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.status(200).json(product);
});

// TASK 1: Add to cart
// POST /api/cart  Body: { "userId": 101, "productId": 1, "quantity": 2 }
app.post("/api/cart", (req, res) => {
  const { userId = 101, productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === Number(productId));
  if (!product) return res.status(404).json({ error: "Product not found" });
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) return res.status(400).json({ error: "Quantity must be a positive integer" });
  const user = Number(userId);
  const existing = cart.find(item => item.productId === product.id && item.userId === user);
  const newQuantity = (existing ? existing.quantity : 0) + qty;
  if (newQuantity > product.stock) return res.status(400).json({ error: "Not enough stock" });
  if (existing) existing.quantity = newQuantity;
  else cart.push({ userId: user, productId: product.id, quantity: qty });
  res.status(201).json({ message: "Product added to cart", cart: getCart(user) });
});

function getCart(userId = 101) {
  return cart.filter(item => item.userId === userId).map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, name: product.name, price: product.price, subtotal: product.price * item.quantity };
  });
}

// View cart
app.get("/api/cart", (req, res) => {
  const items = getCart(Number(req.query.userId || 101));
  res.status(200).json({ items, total: items.reduce((sum, item) => sum + item.subtotal, 0) });
});

// TASK 3: Place order
// POST /api/orders Body: { "userId": 101 }
// Success: 201 Created
app.post("/api/orders", (req, res) => {
  const userId = Number(req.body.userId || 101);
  const items = getCart(userId);
  if (!items.length) return res.status(400).json({ error: "Cart is empty" });

  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (item.quantity > product.stock) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
  }

  const order = {
    orderId: nextOrderId++,
    userId,
    items,
    totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
    status: "PENDING_PAYMENT",
    paymentStatus: "PENDING",
    deliveryStatus: "AWAITING_PAYMENT",
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json({
    message: "Order created. Complete payment to confirm it.",
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentEndpoint: `/api/orders/${order.orderId}/payment`
  });
});

// TASK 5 sequence step: simulate payment (no real payment provider)
// POST /api/orders/1001/payment Body: { "method": "UPI" }
app.post("/api/orders/:id/payment", (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.paymentStatus === "PAID") return res.status(200).json({ message: "Payment already completed", orderId: order.orderId, paymentStatus: order.paymentStatus });
  const method = String(req.body.method || "UPI").toUpperCase();
  const allowedMethods = ["UPI", "CARD", "COD"];
  if (!allowedMethods.includes(method)) return res.status(400).json({ error: "Payment method must be UPI, CARD, or COD" });

  // This is a classroom demo only; it does not contact a real payment gateway.
  const payment = {
    paymentId: nextPaymentId++,
    orderId: order.orderId,
    amount: order.totalAmount,
    method,
    status: "SUCCESS",
    paidAt: new Date().toISOString()
  };
  payments.push(payment);
  order.paymentStatus = method === "COD" ? "PAYMENT_DUE_ON_DELIVERY" : "PAID";
  order.status = "CONFIRMED";
  order.deliveryStatus = "PROCESSING";
  order.paymentId = payment.paymentId;

  // Reserve stock once payment/order confirmation succeeds.
  for (const item of order.items) {
    const product = products.find(p => p.id === item.productId);
    product.stock -= item.quantity;
  }
  cart = cart.filter(item => item.userId !== order.userId);

  res.status(200).json({
    message: "Demo payment successful",
    paymentId: payment.paymentId,
    orderId: order.orderId,
    amount: payment.amount,
    method,
    paymentStatus: order.paymentStatus,
    orderStatus: order.status,
    deliveryStatus: order.deliveryStatus
  });
});

// TASK 6: Track order
// GET /api/orders/1001/track
app.get("/api/orders/:id/track", (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found. Check the order ID." });
  res.status(200).json({
    orderId: order.orderId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    deliveryStatus: order.deliveryStatus
  });
});

// Demo-only endpoint to advance delivery status for a practical demonstration.
app.patch("/api/orders/:id/track", (req, res) => {
  const order = orders.find(o => o.orderId === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.paymentStatus === "PENDING") {
    return res.status(400).json({ error: "Complete payment before delivery can start" });
  }
  const stages = ["PROCESSING", "PACKED", "IN_TRANSIT", "DELIVERED"];
  const index = stages.indexOf(order.deliveryStatus);
  order.deliveryStatus = stages[Math.min(index + 1, stages.length - 1)];
  res.status(200).json({ orderId: order.orderId, deliveryStatus: order.deliveryStatus });
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Online Shopping Platform running at http://localhost:${PORT}`));
